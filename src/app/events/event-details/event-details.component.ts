import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { EventService } from '../event.service';
import { Event } from '../../models/event-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  constructor(private route:ActivatedRoute, private eventService:EventService) { }
  
  selectedEvent:Event

  getEvent()
  {
    this.eventService.fetch(parseInt(this.route.snapshot.paramMap.get('event_id'))).subscribe(
      (result) => 
      {
        if (!(result instanceof HttpErrorResponse)) {
          this.selectedEvent = result
        }
      }
    )
  }

  ngOnInit() {
    this.getEvent()
  }

}
