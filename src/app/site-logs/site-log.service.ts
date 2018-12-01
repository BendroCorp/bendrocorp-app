import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { SiteLog } from '../models/misc-models';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SiteLogService {

  constructor(private http:HttpClient, private errorService:ErrorService, private globals:Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Requests service data refresh called!");    
    this.dataRefreshSource.next();
  }

  list() : Observable<SiteLog[]>
  {
    return this.http.get<SiteLog[]>(`${this.globals.baseUrl}/site-logs`).pipe(
      tap(result => console.log(`Fetched ${result.length} site logs!`)),
      catchError(this.errorService.handleError('Fetch Profiles', []))
    )
  }
}
