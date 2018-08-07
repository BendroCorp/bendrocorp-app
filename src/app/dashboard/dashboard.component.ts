import { Component, OnInit } from '@angular/core';
import { EventService } from '../events/event.service';
import { Event } from '../models/event-models';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  nextEvent:Event
  events:Event[]
  constructor(private eventService:EventService) { }

  ngOnInit() {
    this.fetchEvents()
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
          }
        }
      }
    )
  }  

}
