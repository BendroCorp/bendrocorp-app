import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { EventService } from './event.service';
import { Event } from '../models/event-models';
import { MessageService } from '../message/message.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Subscription } from '../../../node_modules/rxjs';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  
  constructor(private authService:AuthService, private eventService:EventService, private messageService:MessageService) { 
    this.subscription = this.eventService.dataRefreshAnnounced$.subscribe(
      () => {
        // if the service tells us to refresh then we refresh
        this.fetchEvents()
        this.fetchExpired()
      }
    )
  }

  isAdmin:boolean = this.authService.hasClaim(19)
  events:Event[]
  expiredEvents:Event[]
  hideShowMoreExpiredEventsDisabled:boolean = false
  hideShowMoreExpiredEvents:boolean = false;
  subscription:Subscription

  fetchEvents()
  {
    this.eventService.list().subscribe(
      (results) => 
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.events = results
          console.log(results);
          
        }
      }
    )
  }

  fetchExpired(count?:number, hideMore:boolean = false)
  {
    this.hideShowMoreExpiredEventsDisabled = true
    this.eventService.list_expired(count).subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.expiredEvents = results
          this.hideShowMoreExpiredEvents = hideMore
          this.hideShowMoreExpiredEventsDisabled = false
        }
      }
    )
  }

  publishEvent(selectedEvent:Event)
  {
    if (selectedEvent) {
      this.eventService.publish(selectedEvent).subscribe(
        (results) => 
        {
          if (!(results instanceof HttpErrorResponse)) {
            this.events.find(x => x.id === selectedEvent.id).published = true
          }
        }
      )
    }
  }

  ngOnInit() {

    this.fetchEvents()
    if (this.isAdmin) {
      this.fetchExpired()
    }
  }

  ngOnDestroy() {
    // NO MEMORY LEAKS :)
    this.subscription.unsubscribe()
  }

}
