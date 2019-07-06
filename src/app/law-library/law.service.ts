import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Law, LawCategory, Jurisdiction } from '../models/law.model'
import { tap, catchError } from 'rxjs/operators';
import { StatusMessage } from '../models/misc-models';

@Injectable({
  providedIn: 'root'
})
export class LawService {

  constructor(private http:HttpClient, private messageService:MessageService, private errorService:ErrorService, private globals:Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Law service data refresh called!");    
    this.dataRefreshSource.next();
  } 
  
  listJurisdictions() : Observable<Jurisdiction[]>
  {
    return this.http.get<Jurisdiction[]>(`${this.globals.baseUrl}/law/jurisdiction`).pipe(
      tap(results => console.log(`Fetched ${results.length} jurisdictions!`)),
      catchError(this.errorService.handleError('Fetch Laws', []))
    )
  }

  fetchJurisdiction(jurisdiction_id: number): Observable<Jurisdiction> {
    return this.http.get<Jurisdiction>(`${this.globals.baseUrl}/law/jurisdiction/${jurisdiction_id}`).pipe(
      tap(result => console.log(`Fetched jurisdiction!`)),
      catchError(this.errorService.handleError('Fetch Jurisdiction'))
    )
  }

  listCategories(jurisdiction_id: number) : Observable<LawCategory[]>
  {
    return this.http.get<LawCategory[]>(`${this.globals.baseUrl}/law/category/${jurisdiction_id}`).pipe(
      tap(results => console.log(`Fetched ${results.length} law categories!`)),
      catchError(this.errorService.handleError('Fetch Law Categories', []))
    )
  }

  createLaw(law: Law): Observable<Law> {
    return this.http.post<Law>(`${this.globals.baseUrl}/law`, { law }).pipe(
      tap(results => console.log(`Created a new law!`)),
      catchError(this.errorService.handleError<any>('Create Law'))
    )
  }

  updateLaw(law: Law): Observable<Law>  {
    return this.http.put<Law>(`${this.globals.baseUrl}/law`, { law }).pipe(
      tap(results => console.log(`Updated a law!`)),
      catchError(this.errorService.handleError<any>('Update Law'))
    )
  }

  archiveLaw(law: Law): Observable<StatusMessage>  {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/law/${law.id}`).pipe(
      tap(results => console.log(`Updated a law!`)),
      catchError(this.errorService.handleError<any>('Archive Law'))
    )
  }

  createJurisdiction(jurisdiction: Jurisdiction): Observable<Jurisdiction>  {
    return this.http.post<Jurisdiction>(`${this.globals.baseUrl}/law/jurisdiction`, { jurisdiction }).pipe(
      tap(results => console.log(`Created a new law!`)),
      catchError(this.errorService.handleError<any>('Create Jurisdiction'))
    )
  }

  updateJurisdiction(jurisdiction: Jurisdiction): Observable<Jurisdiction> {
    return this.http.put<Jurisdiction>(`${this.globals.baseUrl}/law/jurisdiction`, { jurisdiction }).pipe(
      tap(results => console.log(`Updated a law!`)),
      catchError(this.errorService.handleError<any>('Update Jurisdiction'))
    )
  }

  archiveJurisdiction(jurisdiction: Jurisdiction): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/law/jurisdiction/${jurisdiction.id}`).pipe(
      tap(results => console.log(`Updated a law!`)),
      catchError(this.errorService.handleError<any>('Archive Jurisdiction'))
    )
  }

  createCategory(category: LawCategory): Observable<LawCategory> {
    return this.http.post<LawCategory>(`${this.globals.baseUrl}/law/category`, { category }).pipe(
      tap(results => console.log(`Created a new law category!`)),
      catchError(this.errorService.handleError<any>('Create Law Category'))
    )
  }

  updateCategory(category: LawCategory): Observable<LawCategory> {
    return this.http.put<LawCategory>(`${this.globals.baseUrl}/law/category`, { category }).pipe(
      tap(results => console.log(`Updated a law category!`)),
      catchError(this.errorService.handleError<any>('Update Law Category'))
    )
  }

  archiveCategory(category: LawCategory): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/law/category/${category.id}`).pipe(
      tap(results => console.log(`Archived a law category!`)),
      catchError(this.errorService.handleError<any>('Archive Law Category'))
    )
  }

}
