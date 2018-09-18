import { Injectable } from '@angular/core';
import { Subject, interval, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { StatusMessage } from '../../models/misc-models';
import { Globals } from '../../globals';
import { ErrorService } from '../../error.service';

@Injectable({
  providedIn: 'root'
})
export class ApiOfflineService {

  private apiOffline:boolean = false 
  private dataRefreshSource = new Subject();

  constructor(private http:HttpClient, private error:ErrorService, private globals:Globals) {
    // perform an initial immediate check
    this.healthCheck().subscribe(
      (results) => {

        // handle initial results
        if (!(results instanceof HttpErrorResponse)) {
          this.apiOffline = false
        } else {
          this.apiOffline = true
        }

        this.refreshData()

        // now perform every 10 seconds
        interval(10 * 1000).subscribe(() => {
          // do health check
          this.healthCheck().subscribe(
            (results) =>
            {
              if (!(results instanceof HttpErrorResponse)) {
                this.apiOffline = false
              } else {
                this.apiOffline = true
              }

              // signal app offline component that there is an update
              this.refreshData();
            }
          )
        })
      }
    )    
  }
  /**
   * An observable which can be subcribed to which allows you to detect when a data refresh is announced.
   */
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();

  /**
   * 
   * @returns Boolean value indicating whether or not the API health check passed. Returns true if API is OFFLINE.
   */
  appOnline() : boolean
  {
    return this.apiOffline
  }

  /**
   * Request for an API health check to be performed immediately
   */
  requestCheck()
  {
    this.healthCheck()
  }

  /**
   * Performs a simple health against 
   * @returns A status message object
   */
  private healthCheck() : Observable<StatusMessage>
  {
    return this.http.get<StatusMessage>(`${this.globals.baseUrlRoot}`).pipe(
      tap(result => console.log("API Health check performed")),
      catchError(this.error.handleError<any>('Health Check', null, true))
    )
  }

  /**
   * This will cause a data refresh to be announced to all subscribers.
   */
  private refreshData()
  {
    console.log("Health check refresh called!");    
    this.dataRefreshSource.next();
  }
}
