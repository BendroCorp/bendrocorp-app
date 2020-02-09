import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FieldService } from 'src/app/misc/field.service';
import { Field, FieldDescriptorClass } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'src/app/message/message.service';

@Component({
  selector: 'field-admin-create-update-modal',
  templateUrl: './field-admin-create-update-modal.component.html',
  styleUrls: ['./field-admin-create-update-modal.component.css']
})
export class FieldAdminCreateUpdateModalComponent implements OnInit {
  @Input() field: Field;
  descriptorClasses: FieldDescriptorClass[] = [];
  modal: NgbModalRef;
  formAction: string;

  constructor(
    private modalService: NgbModal,
    private fieldService: FieldService,
    private messageService: MessageService
  ) {}

  open(content) {
    if (this.field && this.field.id) {
      if (!this.field.read_only) {
        this.formAction = 'Update';
      } else {
        this.messageService.addError('You cannot edit a read only field!');
        this.modal.close();
        return;
      }
    } else {
      this.formAction = 'Create';
      this.field = {} as Field;
    }

    // fetch things to make the modal go
    this.fetchFieldDescriptorClasses();
    this.modal = this.modalService.open(content, {ariaLabelledBy: 'create-update-field-modal'});
  }

  close() {
    this.modal.close();
  }

  fetchFieldDescriptorClasses() {
    this.fieldService.getFieldDescriptorClasses().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.descriptorClasses = [];
        this.descriptorClasses.push({ id: null, title: 'Manual Descriptors (No Class)'} as FieldDescriptorClass);
        this.descriptorClasses = this.descriptorClasses.concat(results);
      }
    });
  }

  addUpdateField() {
    if (this.field && this.field.id) {
      this.fieldService.updateField(this.field).subscribe((results => {
        if (!(results instanceof HttpErrorResponse)) {
          this.fieldService.refreshData();
          this.messageService.addSuccess('Field updated!');
          this.modal.close();
        }
      }));
    } else {
      this.fieldService.addField(this.field).subscribe((results => {
        if (!(results instanceof HttpErrorResponse)) {
          this.fieldService.refreshData();
          this.messageService.addSuccess('Field created!');
          this.modal.close();
        }
      }));
    }
  }

  ngOnInit() {
    
  }
}
