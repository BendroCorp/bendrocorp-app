import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { DonationItem } from 'src/app/models/misc-models';
import { DonationService } from '../donation.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'create-update-donation-modal',
  templateUrl: './create-update-donation-modal.component.html',
  styleUrls: ['./create-update-donation-modal.component.css']
})
export class CreateUpdateDonationModalComponent implements OnInit {
  @Input() donationItem:DonationItem
  formAction:string
  openModal: NgbModalRef
  constructor(private modalService: NgbModal, private donationService:DonationService, private messageService:MessageService) { }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'Create Update Donation Item'})
  }

  close()
  {
    if (this.openModal) {
      this.openModal.close()
    }
  }

  createUpdateDonationItem()
  {
    if (this.donationItem && this.donationItem.id) {
      this.donationService.update(this.donationItem).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            // this.donationService.refreshData()
            this.messageService.addSuccess("Donation item was successfully updated!")
            this.close()
          }
        }
      )
    } else {
      this.donationService.create(this.donationItem).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.donationService.refreshData()
            this.messageService.addSuccess("Donation item was successfully created!")
            this.close()
          }
        }
      )
    }
  }

  archiveDonationItem()
  {
    if (this.donationItem && this.donationItem.id) {
      if (confirm("Are you sure you want to archive this donation item?")) {
        this.donationService.archive(this.donationItem).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.donationService.refreshData()
              this.messageService.addSuccess("Donation item was successfully archived!")
              this.close()
            }
          }
        )
      }
    }
  }

  ngOnInit() {
    if (this.donationItem && this.donationItem.id) {
      this.formAction = "Update"
    } else {
      this.formAction = "Create"
      this.donationItem = { } as DonationItem
    }
  }

}
