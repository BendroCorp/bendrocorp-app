import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { AuthClient, ReportResource } from '@bendrocorp/bendrocorp-node-sdk';
import { Report, ReportField, ReportFieldValue, ReportTemplate } from '@bendrocorp/bendrocorp-node-sdk/models/report.model';
import { ReportService } from './report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit, OnDestroy {
  isReportBuilder: boolean = this.authService.hasClaim(48);
  isReportAdmin: boolean = this.authService.hasClaim(49);
  reports: Report[] = [];
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private reportService: ReportService,
    private router: Router
  ) { 
    this.subscription = this.reportService.reportsRefreshAnnounced$.subscribe(() => {
      this.fetchReports();
    });
  }

  fetchReports() {
    this.reportService.listReports().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.reports = results;
      }
    });
  }

  openReport(report: Report) {
    if (report && report.id) {
      this.router.navigateByUrl(`/forms/${report.id}`);
    }
  }

  openTemplates() {
    if (this.isReportBuilder) {
      this.router.navigateByUrl('forms/templates');
    }
  }

  ngOnInit() {
    this.fetchReports();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
