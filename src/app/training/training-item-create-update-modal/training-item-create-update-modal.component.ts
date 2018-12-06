import { Component, OnInit, Input } from '@angular/core';
import { TrainingItem, TrainingCourse, TrainingItemType } from 'src/app/models/training-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrainingService } from '../training.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'training-item-create-update-modal',
  templateUrl: './training-item-create-update-modal.component.html',
  styleUrls: ['./training-item-create-update-modal.component.css']
})
export class TrainingItemCreateUpdateModalComponent implements OnInit {
  @Input() trainingItem: TrainingItem
  @Input() trainingCourse: TrainingCourse
  itemTypes: TrainingItemType[] = []
  openModal: NgbModalRef
  formAction: string
  constructor(private modalService: NgbModal, private trainingService: TrainingService) { }

  open(content) {
    if (!(this.trainingItem && this.trainingItem.id)) {
      this.trainingItem = { training_course_id: this.trainingCourse.id } as TrainingItem
    }

    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'Create Update Training Course'})
  }

  close() {
    if (this.openModal) {
      this.openModal.close()
    }
  }

  createUpdateTrainingCourse() {
    if (this.trainingItem.id) {
      this.trainingService.updateTrainingItem(this.trainingItem).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.trainingService.refreshData()
            this.close()
          }
        }
      )
    } else {
      this.trainingService.createTrainingItem(this.trainingItem).subscribe(
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
    if (this.trainingItem && this.trainingItem.id) {
      if (confirm("Are you sure you want to archive this training course?")) {
        this.trainingService.archiveTrainingItem(this.trainingItem).subscribe(
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

  fetchTypes() {
    this.trainingService.fetchTypes().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.itemTypes = results
        }
      }
    )
  }

  ngOnInit() {
    this.fetchTypes()
    if (this.trainingItem && this.trainingItem.id) {
      this.formAction = 'Update'
    } else {
      this.formAction = 'Create'
    }    
  }

}
