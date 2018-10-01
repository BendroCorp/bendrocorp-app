import { Injectable } from '@angular/core';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StarSystem } from '../models/system-map-models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SystemMapService {

  constructor(private http:HttpClient, private errorService:ErrorService, private globals:Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("System Map service data refresh called!");    
    this.dataRefreshSource.next();
  }

  list() : Observable<StarSystem[]>
  {
    return this.http.get<StarSystem[]>(`${this.globals.baseUrl}/system-map`).pipe(
      tap(result => {
        console.log(`Fetched ${result.length} star systems!`)
        console.log(result)
      }),
      catchError(this.errorService.handleError('Fetch Job Board', []))
    )
  }
}
