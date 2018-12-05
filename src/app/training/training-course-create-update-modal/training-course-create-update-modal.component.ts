import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrainingCourse } from 'src/app/models/training-models';
import { TrainingService } from '../training.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'training-course-create-update-modal',
  templateUrl: './training-course-create-update-modal.component.html',
  styleUrls: ['./training-course-create-update-modal.component.css']
})
export class TrainingCourseCreateUpdateModalComponent implements OnInit {
  @Input() trainingCourse: TrainingCourse
  openModal: NgbModalRef
  formAction: string
  constructor(private modalService: NgbModal, private trainingService: TrainingService) { }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  close() {
    if (this.openModal) {
      this.openModal.close()
    }
  }

  createUpdateTrainingCourse() {
    if (this.trainingCourse.id) {
      this.trainingService.updateCourse(this.trainingCourse).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.trainingService.refreshData()
            this.close()
          }
        }
      )
    } else {
      this.trainingService.createCourse(this.trainingCourse).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.trainingService.refreshData()
            this.close()
          }
        }
      )
    }
  }

  ngOnInit() {
    if (this.trainingCourse && this.trainingCourse.id) {
      this.formAction = 'Update'
    } else {
      this.formAction = 'Create'
      this.trainingCourse = { } as TrainingCourse
    }
  }

}
