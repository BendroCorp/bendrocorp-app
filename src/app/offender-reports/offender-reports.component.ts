import { Component, OnInit } from '@angular/core';
import { OffenderReportService } from './offender-report.service';
import { MessageService } from '../message/message.service';
import { OffenderReport, Offender, ViolenceRating } from '../models/offender-report-models';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-offender-reports',
  templateUrl: './offender-reports.component.html',
  styleUrls: ['./offender-reports.component.css']
})
export class OffenderReportsComponent implements OnInit {
  offenderReports:Offender[] = []
  adminOffenderReports:OffenderReport[] = []
  myOffenderReports:OffenderReport[] = []
  violenceRatings:ViolenceRating[]
  
  isAdmin = this.authService.hasClaim(16)
  subscription:Subscription
  constructor(private offenderReportService:OffenderReportService, private messageService:MessageService, private authService:AuthService) { 
    this.subscription = this.offenderReportService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchReports()
      }
    )
  }

  fetchReports()
  {
    if (this.isAdmin) {
      this.offenderReportService.list_admin().subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.adminOffenderReports = results
          }
        }
      )
    }

    this.offenderReportService.list_mine().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.myOffenderReports = results
        }
      }
    )

    this.offenderReportService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.offenderReports = results
        }
      }
    )
  }

  ngOnInit() {
    this.offenderReportService.list_rating().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.violenceRatings = results
        }
      }
    )
    this.fetchReports()
  }

}
