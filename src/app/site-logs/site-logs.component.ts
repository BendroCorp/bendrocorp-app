import { Component, OnInit } from '@angular/core';
import { SiteLog } from '../models/misc-models';
import { SiteLogService } from './site-log.service';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';

@Component({
  selector: 'app-site-logs',
  templateUrl: './site-logs.component.html',
  styleUrls: ['./site-logs.component.css']
})
export class SiteLogsComponent implements OnInit {
  siteLogs:SiteLog[] = []
  canViewLogs: boolean = this.authService.hasClaim(2)

  constructor(private siteLogService:SiteLogService, private spinnerService:SpinnerService, private authService:AuthService, private router:Router, private messageService:MessageService) { }

  fetchLogs()
  {
    this.siteLogService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.siteLogs = results.sort((a, b) => {
            return b.id - a.id
          })
          this.spinnerService.spin(false)
        }
      }
    )    
  }

  ngOnInit() {
    if (this.canViewLogs) {
      this.spinnerService.spin(true)
      this.fetchLogs();
    } else {
      this.messageService.addError('You are not authorized to view this page!')
      this.router.navigateByUrl('/')
    }
  }

}
