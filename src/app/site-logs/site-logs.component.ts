import { Component, OnInit, OnDestroy } from '@angular/core';
import { SiteLog } from '../models/misc-models';
import { SiteLogService } from './site-log.service';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { Subscription } from 'rxjs';
import { Globals } from '../globals';

@Component({
  selector: 'app-site-logs',
  templateUrl: './site-logs.component.html',
  styleUrls: ['./site-logs.component.css']
})
export class SiteLogsComponent implements OnInit, OnDestroy {
  logSubscription: Subscription;
  siteLogs:SiteLog[] = []
  canViewLogs: boolean = this.authService.hasClaim(2)
  logRefreshInProgress: boolean;
  initialLoadComplete: boolean = false;

  constructor(private globals: Globals,
    private siteLogService:SiteLogService, 
    private spinnerService:SpinnerService, 
    private authService:AuthService, 
    private router:Router, 
    private messageService:MessageService,
    private cableService: ActionCableService) { }

  fetchLogs()
  {
    this.logRefreshInProgress = true;
    this.siteLogService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.siteLogs = results.sort((a, b) => {
            return b.id - a.id
          });

          this.initialLoadComplete = true;
        }
        this.spinnerService.spin(false);
        this.logRefreshInProgress = false;
      }
    )    
  }

  ngOnInit() {
    if (this.canViewLogs) {
      // const channel: Channel = this.cableService
      // .cable(`${this.globals.wssUri}/?token=${this.authService.retrieveUserSession().token}`)
      // .channel('LogChannel');

      // this.logSubscription = channel.received().subscribe(message => {
      //     this.fetchLogs();
      // });

      this.spinnerService.spin(true);
      this.fetchLogs();
    } else {
      this.messageService.addError('You are not authorized to view this page!');
      this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy() {
    if (this.logSubscription) {
      this.logSubscription.unsubscribe();
    }
  }

}
