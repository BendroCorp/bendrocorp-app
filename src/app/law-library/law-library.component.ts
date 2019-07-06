import { Component, OnInit, OnDestroy } from '@angular/core';
import { LawService } from './law.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Jurisdiction } from '../models/law.model';
import { Subscription } from 'rxjs';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-law-library',
  templateUrl: './law-library.component.html',
  styleUrls: ['./law-library.component.css']
})
export class LawLibraryComponent implements OnInit, OnDestroy {
  lawJurisdictions: Jurisdiction[];
  lawSubscription: Subscription;
  newJurisdiction: Jurisdiction = { } as Jurisdiction;
  newJurisdictionInProgress: boolean = false;

  constructor(private lawService: LawService, 
    private authService: AuthService, 
    private router: Router, 
    private messageService: MessageService,
    private confirmationModal: ConfirmationModal) {
    this.lawSubscription = this.lawService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchJurisdictions();
    });
  }

  openJurisdiction(jurisdiction: Jurisdiction) {
    if (jurisdiction.id) {
      this.router.navigateByUrl(`/law-library/${jurisdiction.id}`);
    }
  }

  addJurisdiction() {
    if (this.newJurisdiction.title) {
      this.newJurisdictionInProgress = true;
      this.lawService.createJurisdiction(this.newJurisdiction).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.lawJurisdictions.push(results);
          this.messageService.addSuccess('Jurisdiction added!');
          this.newJurisdiction = {} as Jurisdiction;
        }
        this.newJurisdictionInProgress = false;
      });
    }
  }

  updateJurisdiction(jurisdiction: Jurisdiction) {
    if (jurisdiction.id) {
      this.lawService.updateJurisdiction(jurisdiction).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.messageService.addSuccess('Jurisdiction updated!')
        }
      });
    }
  }

  async archiveJurisdiction(jurisdiction: Jurisdiction) {
    if (jurisdiction.id) {
      if (await this.confirmationModal.open('Are you sure you want to remove this jurisdiction?')) {
        this.lawService.archiveJurisdiction(jurisdiction).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.lawJurisdictions.splice(this.lawJurisdictions.findIndex(x => x.id === jurisdiction.id), 1);
          }
        });
      }
    }
  }

  fetchJurisdictions() {
    this.lawService.listJurisdictions().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.lawJurisdictions = results;
      }
    });
  }

  ngOnInit() {
    if (!this.authService.hasClaim(43)) {
      this.messageService.addError('You are not authorized to directly access the law library!');
      this.router.navigateByUrl('/');
    } else {
      this.fetchJurisdictions();
    }
  }

  ngOnDestroy() {
    if (this.lawSubscription) {
      this.lawSubscription.unsubscribe();
    }
  }

}
