import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { EventService } from '../event.service';
import { Event } from '../../models/event-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { SpinnerService } from '../../misc/spinner/spinner.service';
import { AuthService } from 'src/app/auth.service';
import { Subscription } from 'rxjs';
import { MessageService } from 'src/app/message/message.service';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit, OnDestroy {  
  
  constructor(private route:ActivatedRoute, private eventService:EventService, private spinnerService:SpinnerService, private authService:AuthService, private messageService:MessageService, private router:Router) {
    this.subscription = this.eventService.dataRefreshAnnounced$.subscribe(
      () => {
        this.getEvent()
      }
    )
   }
  isAdmin:boolean = this.authService.hasClaim(19) // can CRUD events
  eventId:number = parseInt(this.route.snapshot.paramMap.get('event_id'))
  selectedEvent:Event
  subscription:Subscription

  getEvent()
  {
    this.eventService.fetch(this.eventId).subscribe(
      (result) => 
      {
        if (!(result instanceof HttpErrorResponse)) {
          this.spinnerService.spin(false)
          if (result.is_expired && !this.isAdmin) {
            // Not sure if this is needed or not
            this.messageService.addError('This event is expired and you do not have permission to access it!')
            this.router.navigateByUrl('/events')
          }else{
            this.selectedEvent = result
          }          
        }
      }
    )
  }

  publishEvent()
  {
    if (this.selectedEvent) {
      this.eventService.publish(this.selectedEvent).subscribe(
        (results) => 
        {
          if (!(results instanceof HttpErrorResponse)) {
            this.selectedEvent.published = true
            this.getEvent()
          }
        }
      )
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.getEvent()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
