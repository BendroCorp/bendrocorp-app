import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { UserSessionResponse } from '../models/user-models';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor (private http:HttpClient, private errorService:ErrorService, private globals:Globals) {}

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Job board service data refresh called!");    
    this.dataRefreshSource.next();
  }

  requestImpersonationToken(userId: number) : Observable<UserSessionResponse>
  {
    return this.http.get<UserSessionResponse>(`${this.globals.baseUrl}/admin/impersonate/${userId}`).pipe(
      tap(result => console.log("User Impersonation Requested")),
      catchError(this.errorService.handleError('User Impersonation'))
    );
  }
}
