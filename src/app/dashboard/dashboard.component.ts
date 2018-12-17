import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../events/event.service';
import { Event } from '../models/event-models';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  nextEvent:Event
  events:Event[]
  eventStartedSubscription:Subscription
  showCountdown:boolean
  checkerStarted:boolean

  constructor(private eventService:EventService) { }

  ngOnInit() {
    this.fetchEvents()
  }

  ngOnDestroy() {
    if (this.eventStartedSubscription) {
      this.eventStartedSubscription.unsubscribe()
    }
  }

  fetchEvents()
  {
    this.eventService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log(results);
          if (results.length > 0) {
            this.nextEvent = results.slice(0,1)[0]
            console.log(this.nextEvent)            
            this.events = results.splice(0,1)
            console.log(this.events)
            
            if (this.nextEvent) {
              this.eventStartedSubscription = interval(500).subscribe(
                () => {
                  
                  // if the start date is less than now
                  let eventStart = new Date(this.nextEvent.start_date).getTime()
                  let current = new Date().getTime()
                  if (eventStart > current) {
                    this.showCountdown = true
                    
                  }else{
                    this.showCountdown = false
                    this.eventStartedSubscription.unsubscribe()
                  }
                  this.checkerStarted = true
                }
              )
            }
          }
        }
      }
    )
  }  

}
