import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../event.service';
import { NgbModal, NgbModalRef } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { Event, EventAttendence, AttendenceType } from '../../models/event-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

@Component({
  selector: 'event-certification-modal',
  templateUrl: './event-certification-modal.component.html',
  styleUrls: ['./event-certification-modal.component.css']
})
export class EventCertificationModalComponent implements OnInit {

  @Input() event:Event
  attendences:EventAttendence[]
  attendenceTypes:AttendenceType[]
  debriefingText:string
  openModal:NgbModalRef
  attendenceSubmitting:boolean = false
  constructor(private modalService: NgbModal, private eventService:EventService) { }

  open(content) {
    console.log(this.attendences);
    
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

  submitForCertification()
  {
    if (this.event) {
      this.attendenceSubmitting = true
      this.eventService.certification(this.event.id, this.attendences, this.debriefingText).subscribe(
        (results) =>
        {
          this.attendenceSubmitting = false
          if (!(results instanceof HttpErrorResponse)) {
            this.eventService.refreshData()
            this.openModal.close()
          }
        }
      )
    }
  }

  fetchAttendences()
  {
    this.eventService.startCertification(this.event).subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.attendences = results
        }
      }
    )
  }

  ngOnInit() {
    this.eventService.list_attendence_types().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.attendenceTypes = results
          this.fetchAttendences()
        }
      }
    )
  }

}
