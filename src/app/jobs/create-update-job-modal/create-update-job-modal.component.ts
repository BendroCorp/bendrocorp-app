import {Component, OnInit, Input} from '@angular/core';

import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import { Job } from 'src/app/models/character-models';
import { JobsService } from '../jobs.service';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'create-update-job-modal',
  templateUrl: './create-update-job-modal.component.html',
  styleUrls: ['./create-update-job-modal.component.css']
})
export class CreateUpdateJobModalComponent implements OnInit {
  @Input() job: Job
  openModal: NgbModalRef
  formAction: string

  constructor(private modalService: NgbModal, private jobService:JobsService, private messageService: MessageService) {}

  createUpdateCharacterJob() {
    if (this.job && this.job.id) {
      this.jobService.update(this.job).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.jobService.refreshData()
            this.close()
          }
        }
      )
    } else {
      this.jobService.create(this.job).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.jobService.refreshData()
            this.close()
          }
        }
      )
    }
  }

  ngOnInit() {
    if (this.job && this.job.id) {
      console.log(this.job)
      this.formAction = "Update"
    } else {
      this.job = { } as Job
      this.formAction = "Create"
    }
  }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'Create/Update Job Modal'})
  }

  close()
  {
    if (this.openModal) {
      this.openModal.close()
    }
  }
}
