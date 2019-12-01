import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FactionAffiliation, StatusMessage } from '../models/misc-models';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FactionService {

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log('Faction admin service data refresh called!');   
    this.dataRefreshSource.next();
  }

  constructor(private http: HttpClient, private messageService: MessageService, private errorService: ErrorService, private globals: Globals) { }

  listFactions(): Observable<FactionAffiliation[]> {
    return this.http.get<FactionAffiliation[]>(`${this.globals.baseUrl}/factions`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Factions'))
    );
  }

  createFaction(faction: FactionAffiliation): Observable<FactionAffiliation> {
    return this.http.post<FactionAffiliation>(`${this.globals.baseUrl}/factions`, { faction }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Create Faction'))
    );
  }

  updateFaction(faction: FactionAffiliation): Observable<FactionAffiliation> {
    return this.http.put<FactionAffiliation>(`${this.globals.baseUrl}/factions`, { faction }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Faction'))
    );
  }

  archiveFaction(faction: FactionAffiliation): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/factions/${faction.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Archive Faction'))
    );
  }
}
