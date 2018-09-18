import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { Offender, ViolenceRating, OffenderReport } from '../models/offender-report-models';
import { tap, catchError } from 'rxjs/operators';
import { JobBoardMission } from '../models/job-board-models';

@Injectable({
  providedIn: 'root'
})
export class OffenderReportService {

  constructor(private http:HttpClient, private errorService:ErrorService, private globals:Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Offender Report service data refresh called!");    
    this.dataRefreshSource.next();
  }

  list() : Observable<Offender[]>
  {
    return this.http.get<Offender[]>(`${this.globals.baseUrl}/offender-report`).pipe(
      tap(result => console.log(`Fetched ${result.length} offender reports!`)),
      catchError(this.errorService.handleError('Fetch Offender', []))
    )
  }

  list_mine() : Observable<OffenderReport[]>
  {
    return this.http.get<OffenderReport[]>(`${this.globals.baseUrl}/offender-report/mine`).pipe(
      tap(result => console.log(`Fetched ${result.length} offender reports of mine!`)),
      catchError(this.errorService.handleError('Fetch My Offender Reports', []))
    )
  }

  list_admin() : Observable<OffenderReport[]>
  {
    return this.http.get<OffenderReport[]>(`${this.globals.baseUrl}/offender-report/admin`).pipe(
      tap(result => console.log(`Fetched ${result.length} offender reports!`)),
      catchError(this.errorService.handleError('Fetch Admin Offender Reports', []))
    )
  }

  list_rating() : Observable<ViolenceRating[]>
  {
    return this.http.get<ViolenceRating[]>(`${this.globals.baseUrl}/offender-report/types`).pipe(
      tap(result => console.log(`Fetched ${result.length} violence ratings!`)),
      catchError(this.errorService.handleError('Fetch Violence Ratings', []))
    )
  }  

  create(offender_report:OffenderReport) : Observable<OffenderReport>
  {
    return this.http.post<OffenderReport>(`${this.globals.baseUrl}/offender-report`, { offender_report }).pipe(
      tap(result => console.log(`Created Offender Report with id# ${result.id}!`)),
      catchError(this.errorService.handleError<any>('Create Offender Report'))
    )
  }

  update(offender_report:OffenderReport) : Observable<OffenderReport>
  {
    return this.http.patch<OffenderReport>(`${this.globals.baseUrl}/offender-report`, { offender_report }).pipe(
      tap(result => console.log(`Updated Offender Report with id# ${result.id}!`)),
      catchError(this.errorService.handleError<any>('Update Offender Report'))
    )
  }

  submit(offender_report:OffenderReport) : Observable<OffenderReport>
  {
    return this.http.post<OffenderReport>(`${this.globals.baseUrl}/offender-report/submit`, { offender_report }).pipe(
      tap(result => console.log(`Submitted Offender Report with id# ${result.id}!`)),
      catchError(this.errorService.handleError<any>('Submit Offender Report'))
    )
  }
}
