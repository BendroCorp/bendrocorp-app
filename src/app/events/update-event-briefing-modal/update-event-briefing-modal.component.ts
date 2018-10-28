import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../event.service';
import { ProfileService } from '../../profiles/profile.service';
import { Character } from '../../models/character-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { Event } from '../../models/event-models';
import { MessageService } from '../../message/message.service';
import { NgbModal, NgbModalRef } from '../../../../node_modules/@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'event-briefing-modal',
  templateUrl: './update-event-briefing-modal.component.html',
  styleUrls: ['./update-event-briefing-modal.component.css']
})
export class UpdateEventBriefingModalComponent implements OnInit {

  constructor(private modalService: NgbModal, private eventService:EventService, private profileService:ProfileService, private messageService:MessageService) { }
  @Input() event:Event;
  characters:Character[]
  openModal:NgbModalRef
  updateSubmitting:boolean = false

  open(content) {
    if (this.event && this.event.briefing) {
      this.openModal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
    }else{
      if (this.event) {
        this.messageService.addError(`Error: Briefing object does not exist on event ${this.event.id}`)
      } else {
        this.messageService.addError(`Error: Event not passed properly to briefing modal`)
      }
    }
  }

  doUpdate()
  {
    if (this.event && this.event.briefing) {
      this.updateSubmitting = true
      this.eventService.briefing(this.event.briefing).subscribe(
        (result) => 
        {
          if (!(result instanceof HttpErrorResponse)) {
            // close the modal
            console.log(result);
            
            this.eventService.refreshData();
            this.openModal.close()
          }else{
            this.updateSubmitting = false
          }
        }
      )
    }
  }

  ngOnInit() {
    if (this.event) {
      console.log('event briefing modal');
      console.log(this.event);
      console.log(this.event.briefing);
            
      
      this.profileService.list().subscribe(
        (results) =>
        {
          if (!(results instanceof HttpErrorResponse)) {
            this.characters = results
          }
        }
      )
    } else {
      this.messageService.addError('Briefing Modal: Event not properly passed to edit briefing modal!')
    }
  }

}
