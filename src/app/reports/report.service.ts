import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { Report, ReportField, ReportFieldValue, ReportTemplate, ReportHandler, ReportRoute } from '@bendrocorp/bendrocorp-node-sdk/models/report.model';
import { catchError, tap } from 'rxjs/operators';
import { StatusMessage } from '../models/misc-models';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private messageService: MessageService, private errorService: ErrorService, private globals: Globals) { }

  private reportsRefreshSource = new Subject();
  reportsRefreshAnnounced$ = this.reportsRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshReportsData()
  {
    console.log("Reports service reports data refresh called!");    
    this.reportsRefreshSource.next();
  }

  private templatesRefreshSource = new Subject();
  templatesRefreshAnnounced$ = this.templatesRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshTemplatesData()
  {
    console.log("Reports service templates data refresh called!");    
    this.templatesRefreshSource.next();
  }

  listReports(): Observable<Report[]> {
    return this.http.get<Report[]>(`${this.globals.baseUrl}/reports`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Reports'))
    );
  }

  createReport(report: Report): Observable<Report> {
    return this.http.post<Report>(`${this.globals.baseUrl}/reports`, { report }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Report'))
    );
  }

  updateReport(report: Report): Observable<Report> {
    return this.http.put<Report>(`${this.globals.baseUrl}/reports`, { report }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Submit Report'))
    );
  }

  archiveReport(report: Report): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/reports/${report.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Report'))
    );
  }

  listTemplates(): Observable<ReportTemplate[]> {
    return this.http.get<ReportTemplate[]>(`${this.globals.baseUrl}/reports/templates`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Templates'))
    );
  }

  createTemplate(report_template: ReportTemplate): Observable<ReportTemplate> {
    return this.http.post<ReportTemplate>(`${this.globals.baseUrl}/reports/templates`, { report_template }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Template'))
    );
  }

  updateTemplate(report_template: ReportTemplate): Observable<ReportTemplate> {
    return this.http.put<ReportTemplate>(`${this.globals.baseUrl}/reports/templates`, { report_template }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Template'))
    );
  }

  archiveTemplate(report_template: ReportTemplate): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/reports/templates/${report_template.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Templates'))
    );
  }

  createTemplateField(report_field: ReportField): Observable<ReportField> {
    return this.http.post<ReportField>(`${this.globals.baseUrl}/reports/fields`, { report_field }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Field'))
    );
  }

  updateTemplateField(report_field: ReportField): Observable<ReportField> {
    return this.http.put<ReportField>(`${this.globals.baseUrl}/reports/fields`, { report_field }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  archiveTemplateField(report_field: ReportField): Observable<StatusMessage> {
    return this.http.delete<ReportField>(`${this.globals.baseUrl}/reports/fields/${report_field.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Field'))
    );
  }

  updateFieldValue(field_value: ReportFieldValue): Observable<ReportFieldValue> {
    return this.http.put<ReportFieldValue>(`${this.globals.baseUrl}/reports/values`, { field_value }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field Value'))
    );
  }

  listReportHandlers(): Observable<ReportHandler[]> {
    return this.http.get<ReportHandler[]>(`${this.globals.baseUrl}/reports/templates/handlers`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Report Handlers'))
    );
  }

  listReportRoutes(): Observable<ReportRoute[]> {
    return this.http.get<ReportRoute[]>(`${this.globals.baseUrl}/reports/routes`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Report Routes'))
    );
  }
}
