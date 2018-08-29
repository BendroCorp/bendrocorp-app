import { Component, OnInit, OnDestroy } from '@angular/core';
import { FlightLog } from '../models/flight-log-models';
import { AuthService } from '../auth.service';
import { FlightLogService } from './flight-log.service';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-flight-logs',
  templateUrl: './flight-logs.component.html',
  styleUrls: ['./flight-logs.component.css']
})
export class FlightLogsComponent implements OnInit, OnDestroy {  
  flightLogs:FlightLog[]
  subscription:Subscription
  dataLoaded:boolean = false
  constructor(private authService:AuthService, private flightLogService:FlightLogService, private router:Router) { 
    this.subscription = this.flightLogService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchFlightLogs()
      }
    )
  }

  openLog(flightLog:FlightLog)
  {
    if (flightLog) {
      this.router.navigateByUrl(`/flight-logs/${flightLog.id}`)
    }
  }

  fetchFlightLogs()
  {
    this.flightLogService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.flightLogs = results
          this.dataLoaded = true
        }
      }
    )
  }

  ngOnInit() {
    this.fetchFlightLogs()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
