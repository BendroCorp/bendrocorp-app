import { Component, OnInit, Input } from '@angular/core';
import { JobBoardService } from '../job-board.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobBoardMission, JobBoardMissionCompletionCriteria } from '../../models/job-board-models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'edit-job-modal',
  templateUrl: './edit-job-modal.component.html',
  styleUrls: ['./edit-job-modal.component.css']
})
export class EditJobModalComponent implements OnInit {
  @Input() mission:JobBoardMission
  criterium:JobBoardMissionCompletionCriteria[]
  formAction:string
  openModal:NgbModalRef

  constructor(private modalService: NgbModal, private jobBoardService:JobBoardService) { }

  open(content) {
    this.openModal = this.modalService.open(content);
  }

  createUpdateJobBoardMission()
  {
    if (this.mission && this.mission.id) {
      this.jobBoardService.update(this.mission).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.jobBoardService.refreshData()
            this.openModal.close()
          }
        }
      )
    } else {
      this.jobBoardService.create(this.mission).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.jobBoardService.refreshData()
            this.openModal.close()
          }
        }
      )
    }
  }

  ngOnInit() {
    this.jobBoardService.list_criteria().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.criterium = results
        }
      }
    )
    if (this.mission && this.mission.id) {
      this.formAction = "Update"
    } else {
      this.formAction = "Create"
      this.mission = { } as JobBoardMission
    }
  }

}
