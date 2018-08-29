import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FlightLogService } from '../flight-log.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FlightLog } from '../../models/flight-log-models';

@Component({
  selector: 'app-flight-log-details',
  templateUrl: './flight-log-details.component.html',
  styleUrls: ['./flight-log-details.component.css']
})
export class FlightLogDetailsComponent implements OnInit {
  flightLogId:number
  flightLog:FlightLog
  dataLoaded:boolean = false
  constructor(private flightLogService:FlightLogService, private route:ActivatedRoute, private router:Router) { }

  deleteFlightLog()
  {
    if (this.flightLog && this.flightLog.id && this.flightLog.privacy_changes_allowed) {
      if (confirm("Are you sure you want to delete this flight log? This action is permenant and cannot be un-done.")) {
        this.flightLogService.delete(this.flightLog).subscribe(
          (result) => {
            if (!(result instanceof HttpErrorResponse)) {
              this.router.navigateByUrl('/flight-logs')
            }
          }
        )
      }
    }
  }

  ngOnInit() {
    let routeParam = this.route.snapshot.paramMap.get('flight_log_id')
    if (typeof routeParam === "string" && !Number.isNaN(Number(routeParam))) {
      this.flightLogService.fetch(parseInt(routeParam)).subscribe(
        (result) => 
        {
          if (!(result instanceof HttpErrorResponse)) {
            this.flightLog = result
            this.dataLoaded = true
          }
        }
      )
    }    
  }

}
