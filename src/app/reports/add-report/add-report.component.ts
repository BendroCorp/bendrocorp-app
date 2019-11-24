import { Component, OnInit, OnDestroy } from '@angular/core';
import { Report, ReportTemplate } from '@bendrocorp/bendrocorp-node-sdk/models/report.model';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ReportService } from '../report.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'add-report-modal',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.css']
})
export class AddReportComponent implements OnInit, OnDestroy {
  report: Report;
  openModal: NgbModalRef;
  templates: ReportTemplate[] = [];
  subscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private reportService: ReportService,
    private router: Router
  ) {
    this.subscription = this.reportService.templatesRefreshAnnounced$.subscribe(() => {
      this.fetchTemplates();
    });
  }

  open(content) {
    this.report = { } as Report;
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'add-report'});
  }

  createReport() {
    this.reportService.createReport(this.report).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        // this.templates = results;
        this.router.navigateByUrl(`/reports/${results.id}`);
        this.openModal.close();
      }
    });
  }

  fetchTemplates() {
    this.reportService.listTemplates().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        console.log(results);
        this.templates = results.filter(x => !x.draft);
        console.log(this.templates);
      }
    });
  }

  close() {
    this.openModal.close();
  }

  ngOnInit() {
    this.fetchTemplates();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
