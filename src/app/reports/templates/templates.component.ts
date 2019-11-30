import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth.service';
import { MessageService } from 'src/app/message/message.service';
import { Router } from '@angular/router';
import { ReportService } from '../report.service';
import { ReportTemplate } from '@bendrocorp/bendrocorp-node-sdk/models/report.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.css']
})
export class TemplatesComponent implements OnInit, OnDestroy {
  isReportBuilder: boolean = this.authService.hasClaim(48);
  templates: ReportTemplate[] = [];
  subscription: Subscription;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private reportsService: ReportService
  ) { 
    this.subscription = this.reportsService.templatesRefreshAnnounced$.subscribe(() => {
      this.fetchTemplates();
    });
  }

  createTemplate() {
    this.reportsService.createTemplate({ name: 'New Report Template' } as ReportTemplate).subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.router.navigateByUrl(`/reports/templates/${results.id}`);
      }
    });
  }

  fetchTemplates() {
    this.reportsService.listTemplates().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.templates = results;
      }
    });
  }

  ngOnInit() {
    if (!this.isReportBuilder) {
      this.messageService.addError('You are not authorized to create report templates!')
      this.router.navigateByUrl('/');
    } else {
      this.fetchTemplates();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
