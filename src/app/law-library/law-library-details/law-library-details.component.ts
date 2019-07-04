import { Component, OnInit } from '@angular/core';
import { LawService } from '../law.service';
import { AuthService } from 'src/app/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'src/app/message/message.service';
import { Jurisdiction, LawCategory, Law } from 'src/app/models/law.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationModal } from '../../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-law-library-details',
  templateUrl: './law-library-details.component.html',
  styleUrls: ['./law-library-details.component.css']
})
export class LawLibraryDetailsComponent implements OnInit {
  jursidiction: Jurisdiction;
  newJurisdictionCategory: LawCategory = {} as LawCategory;
  newLaw: Law = {} as Law;
  dataMoveInProgress: boolean = false;
  lawType = [{value: 'felony'}, {value: 'misdemeanor'}];

  constructor(private route: ActivatedRoute, 
    private lawService: LawService, 
    private authService: AuthService, 
    private router: Router, 
    private messageService: MessageService,
    private confirmationModal: ConfirmationModal) { }

  addCategory() {
    if (this.jursidiction) {
      if (this.newJurisdictionCategory.title) {
        this.newJurisdictionCategory.jurisdiction_id = this.jursidiction.id;
        this.dataMoveInProgress = true;
        this.lawService.createCategory(this.newJurisdictionCategory).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            console.log(results);
            this.jursidiction.categories.push(results);
            this.newJurisdictionCategory = {} as LawCategory;
          }
          this.dataMoveInProgress = false;
        });
      } else {
        this.messageService.addError('You must add a title to your new category!');
      }
    } else {
      console.error('No jurisdiction - cannot create category!');
    }
  }

  updateCategory(lawCategory: LawCategory) {
    if (lawCategory.id) {
      this.dataMoveInProgress = true;
      this.lawService.updateCategory(lawCategory).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          // this.jursidiction.categories[this.jursidiction.categories.findIndex(x => x.id === law.law_category_id)].laws.push(results);
        }
        this.dataMoveInProgress = false;
      });
    }
  }

  async archiveCategory(lawCategory: LawCategory) {
    if (await this.confirmationModal.open('Are you sure you want to remove this category?')) {
      if (lawCategory.id) {
        this.dataMoveInProgress = true;
        this.lawService.archiveCategory(lawCategory).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.jursidiction.categories.splice(this.jursidiction.categories.findIndex(x => x.id === lawCategory.id),1)
          }
          this.dataMoveInProgress = false;
        });
      }
    }
  }

  addLaw(lawCategory: LawCategory) { 
    if (lawCategory.id) {
      this.newLaw.law_category_id = lawCategory.id;
      this.newLaw.jurisdiction_id = this.jursidiction.id;
      this.dataMoveInProgress = true;
      this.lawService.createLaw(this.newLaw).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.jursidiction.categories[this.jursidiction.categories.findIndex(x => x.id === lawCategory.id)].laws.push(results);
          this.newLaw = {} as Law;
        }
        this.dataMoveInProgress = false;
      });
    }
  }

  updateLaw(law: Law) {
    if (law.id) {
      this.dataMoveInProgress = true;
      this.lawService.updateLaw(law).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          // this.jursidiction.categories[this.jursidiction.categories.findIndex(x => x.id === law.law_category_id)].laws.push(results);
        }
        this.dataMoveInProgress = false;
      });
    }
  }

  async archiveLaw(law: Law) {
    if (law.id) {
      if (await this.confirmationModal.open('Are you sure you want to remove this law?')) {
        this.dataMoveInProgress = true;
        this.lawService.archiveLaw(law).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            // splice out the law that we dont want any more
            this.jursidiction.categories[this.jursidiction.categories.findIndex(x => x.id === law.law_category_id)].laws.splice(
              this.jursidiction.categories[this.jursidiction.categories.findIndex(x => x.id === law.law_category_id)].laws.findIndex(x => x.id === law.id),
            1);
          }
          this.dataMoveInProgress = false;
        });
      }
      
    }
  }

  ngOnInit() {
    if (!this.authService.hasClaim(43)) {
      this.messageService.addError('You are not authorized to directly access the law library!');
      this.router.navigateByUrl('/');
    } else {
      const jurisId = parseInt(this.route.snapshot.paramMap.get('jurisdiction_id'));
      if (jurisId) {
        this.lawService.fetchJurisdiction(jurisId).subscribe((result) => {
          if (!(result instanceof HttpErrorResponse)) {
            this.jursidiction = result;
            console.log(this.jursidiction);
          } else {
            this.router.navigateByUrl('/law-library');
          }
        });
      } else {
        this.messageService.addError('Invalid juristiction id format!');
        this.router.navigateByUrl('/law-library');
      }
    }
  }

}
