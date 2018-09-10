import { Injectable } from '@angular/core';
import { User, Role } from './models/user-models';
import { ErrorService } from './error.service';
import { Globals } from './globals';
import { Subject, Observable } from 'rxjs';
import { MyApproval } from './models/approval-models';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

  list() : Observable<User[]>
  {
    return this.http.get<User[]>(`${this.globals.baseUrl}/user`).pipe(
      tap(results => console.log(`Fetched Users`)),
      catchError(this.errorService.handleError('Fetch Users', []))
    )
  }

  list_roles() : Observable<Role[]>
  {
    return this.http.get<Role[]>(`${this.globals.baseUrl}/role`).pipe(
      tap(results => console.log(`Fetched Roles`)),
      catchError(this.errorService.handleError('Fetch Roles', []))
    )
  }
}
