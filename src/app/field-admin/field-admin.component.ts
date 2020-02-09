import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { FieldService } from '../misc/field.service';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import { Field } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-field-admin',
  templateUrl: './field-admin.component.html',
  styleUrls: ['./field-admin.component.css']
})
export class FieldAdminComponent implements OnInit, OnDestroy {
  isAdmin: boolean = this.authService.hasClaim(52);
  fieldList: Field[] = [];
  fieldsSubscription: Subscription;
  initialDataLoaded: boolean;

  constructor(
    private authService: AuthService, 
    private fieldService: FieldService,
    private router: Router,
    private messageService: MessageService,
    private confirmation: ConfirmationModal
  ) { 
    this.fieldsSubscription = this.fieldService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchFields();
    });
  }

  fetchFields() {
    this.fieldService.listFields().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.fieldList = results;
        this.initialDataLoaded = true;
      }
    });
  }

  splitId(splittableId: string) {
    return splittableId.split('-')[0];
  }

  openField(field: Field) {
    this.router.navigate(['field-admin', field.id]);
  }

  async archiveField(field: Field) {
    if (await this.confirmation.open('Are you sure you want to archive this field?')) {
      this.fieldService.archiveField(field).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.fieldList.splice(this.fieldList.findIndex(x => x.id === field.id), 1);
        }
      });
    }
  }

  ngOnInit() {
    if (!this.isAdmin) {
      this.messageService.addError('You do not have sufficient rights to access the fields admin page!');
      this.router.navigateByUrl('/');
    } else {
      this.fetchFields();
    }
  }

  ngOnDestroy() {
    if (this.fieldsSubscription) {
      this.fieldsSubscription.unsubscribe();
    }
  }
}
