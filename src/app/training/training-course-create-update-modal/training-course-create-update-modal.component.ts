import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { TrainingCourse, MemberBadge } from 'src/app/models/training-models';
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
  courseBadges: MemberBadge[]
  constructor(private modalService: NgbModal, private trainingService: TrainingService) { }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'Create Update Training Course'})
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

  archiveTrainingCourse() {
    if (this.trainingCourse && this.trainingCourse.id) {
      if (confirm("Are you sure you want to archive this training course?")) {
        this.trainingService.archiveCourse(this.trainingCourse).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.trainingService.refreshData()
              this.close()
            }
          }
        )
      }
    }
  }

  fetchBadges() {
    this.trainingService.fetchBadges().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.courseBadges = results
        }
      }
    )
  }

  ngOnInit() {
    this.fetchBadges()
    if (this.trainingCourse && this.trainingCourse.id) {
      this.formAction = 'Update'
    } else {
      this.formAction = 'Create'
      this.trainingCourse = { } as TrainingCourse
    }
  }

}
