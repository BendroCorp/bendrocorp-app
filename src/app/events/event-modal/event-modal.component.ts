import { Component, Input, OnInit } from '@angular/core';

import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventService } from '../event.service';
import { Event, EventType } from '../../models/event-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

@Component({
  selector: 'event-modal',
  templateUrl: './event-modal.component.html',
  styleUrls: ['./event-modal.component.css']
})
export class EventModalComponent implements OnInit {
  
  @Input() event:Event
  eventTypes:EventType[] = []
  formAction:string;
  closeResult: string;
  dateTimePickerSettings = {
    bigBanner: true,
    timePicker: true,
    format: 'MM/dd/yyyy hh:mm a  ',
    defaultOpen: false
  }

  openModal:NgbModalRef

  constructor(private modalService: NgbModal, private eventService:EventService) { }

  ngOnInit() {
    if (this.event && this.event.id) {
      this.formAction = 'Update'
      this.event.start_date = new Date(this.event.start_date)
      this.event.end_date = new Date(this.event.end_date)      
    } else {
      this.formAction = 'Create'
      this.event = { } as Event
    }

    this.eventService.list_types().subscribe(
      (results) => 
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.eventTypes = results
        }
      }
    )
  }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }


  onStartDateSelect(event_date_change:any)
  {
    if (event_date_change && event_date_change.value) {
      console.log(event_date_change.value)    
      let new_date = new Date(event_date_change.value)
      new_date.setSeconds(0)
      console.log(new_date)    
      this.event.start_date_ms = new_date.getTime()
      console.log(this.event.start_date_ms);  
    }  
  }

  onEndDateSelect(event_date_change:any)
  {
    if (event_date_change && event_date_change.value) {
      console.log(event_date_change.value)    
      let new_date = new Date(event_date_change.value)
      new_date.setSeconds(0)
      console.log(new_date)    
      this.event.end_date_ms = new_date.getTime()
      console.log(this.event.end_date_ms);  
    }  
  }

  public logIt(text:string)
  {
    console.log(text);
    
  }

  doSaveBack()
  {
    if (this.event.id) {
      this.eventService.update(this.event).subscribe(
        (results) => {
          // Yay actually do nothing! :D
          // welll actually....
          if (!(results instanceof HttpErrorResponse)) {
            this.eventService.refreshData()
            this.openModal.close()
          }
        }
      )
      console.log(this.event);      
    } else {
      this.eventService.create(this.event).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.eventService.refreshData()
            this.openModal.close()
          }
        }
      )
    }
  }
}
