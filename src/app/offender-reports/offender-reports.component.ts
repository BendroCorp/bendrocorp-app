import { Component, OnInit } from '@angular/core';
import { OffenderReportService } from './offender-report.service';
import { MessageService } from '../message/message.service';
import { OffenderReport, Offender, ViolenceRating } from '../models/offender-report-models';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerService } from '../misc/spinner/spinner.service';

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
  constructor(private offenderReportService:OffenderReportService, private messageService:MessageService, private authService:AuthService, private spinnerService:SpinnerService) { 
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

    this.offenderReportService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.offenderReports = results
        }

        this.offenderReportService.list_mine().subscribe(
          (results) => {
            this.spinnerService.spin(false)
            if (!(results instanceof HttpErrorResponse)) {
              this.myOffenderReports = results
            }
          }
        )
      }
    )  
  }

  ngOnInit() {
    this.spinnerService.spin(true)
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
