import { Component, OnInit, OnDestroy } from '@angular/core';
import { Field, FieldDescriptor } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FieldService } from 'src/app/misc/field.service';
import { MessageService } from 'src/app/message/message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ConfirmationModal } from 'src/app/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-field-admin-details',
  templateUrl: './field-admin-details.component.html',
  styleUrls: ['./field-admin-details.component.css']
})
export class FieldAdminDetailsComponent implements OnInit, OnDestroy {
  field: Field;
  fieldId: string;
  fieldSubscription: Subscription;
  newDescriptorTitle: string;

  constructor(
    private authService: AuthService,
    private modalService: NgbModal,
    private fieldService: FieldService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmation: ConfirmationModal
  ) {
    this.fieldSubscription = this.fieldService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchField();
    });
  }

  fetchField() {
    this.fieldService.getFieldDetails(this.fieldId).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.field = results;
      }
    });
  }

  addDescriptor() {
    if (this.field && this.field.id && !this.field.read_only) {
      this.fieldService.addDescriptor({ title: this.newDescriptorTitle, field_id: this.field.id } as FieldDescriptor).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.field.descriptors.push(results);
          this.newDescriptorTitle = null;
        }
      });
    }
  }

  async archiveDescriptor(descriptor: FieldDescriptor) {
    if (await this.confirmation.open('Are you sure you want to archive this descriptor?')) {
      this.fieldService.archiveDescriptor(descriptor).subscribe((results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.field.descriptors.splice(this.field.descriptors.findIndex(x => x.id === descriptor.id), 1);
        }
      });
    }
  }

  ngOnInit() {
    this.fieldId = this.route.snapshot.paramMap.get('id');
    if (!this.fieldId) {
      this.router.navigate(['field-admin'])
    } else {
      console.log(this.fieldId);
      this.fetchField();
    }
  }

  ngOnDestroy() {
    if (this.fieldSubscription) {
      this.fieldSubscription.unsubscribe();
    }
  }

}
