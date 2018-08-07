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


  public onStartDateSelect(event_date_change:string)
  {
    console.log(event_date_change)    
    let new_date = new Date(event_date_change)
    new_date.setSeconds(0)
    console.log(new_date)    
    this.event.start_date_ms = new_date.getTime()
    console.log(this.event.start_date_ms);    
  }

  public onEndDateSelect(event_date_change:string)
  {
    console.log(event_date_change)    
    let new_date = new Date(event_date_change)
    new_date.setSeconds(0)
    console.log(new_date)    
    this.event.end_date_ms = new_date.getTime()
    console.log(this.event.end_date_ms);    
  }

  public logIt(text:string)
  {
    console.log(text);
    
  }

  // public setStartDateMs(an_event:Event)
  // {
  //   if (an_event) {
  //     console.log(an_event.start_date_ms);
  //     try
  //     {
  //       an_event.start_date_ms = new Date(an_event.start_date).getTime()
  //       console.log(an_event.start_date_ms);
  //     }
  //     catch{ }
  //   } else {
  //     console.error("Event not passed!")
  //   }
  // }

  // public setEndDateMs(an_event:Event)
  // {
  //   if (an_event) {
  //     console.log(an_event.end_date_ms);
  //     try
  //     {
  //       an_event.end_date_ms = new Date(an_event.end_date).getTime()
  //       console.log(an_event.end_date_ms);
  //     }
  //     catch{ }
  //   } else {
  //     console.error("Event not passed!")
  //   }
  // }

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
