import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Role, NestedRole } from '../models/user-models';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StatusMessage } from '../models/misc-models';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private http:HttpClient, private messageService:MessageService, private errorService:ErrorService, private globals:Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Roles service data refresh called!");    
    this.dataRefreshSource.next();
  }

  list() : Observable<Role[]>
  {
    return this.http.get<Role[]>(`${this.globals.baseUrl}/role`).pipe(
      tap(results => console.log(`Fetched ${results.length} roles`)),
      catchError(this.errorService.handleError('Fetch Roles', []))
    )
  }

  createRole(role:Role) : Observable<Role>
  {
    return this.http.post<Role>(`${this.globals.baseUrl}/role`, { role }).pipe(
      tap(results => console.log(`Created role `)),
      catchError(this.errorService.handleError('Create Role'))
    )
  }

  updateRole(role:Role) : Observable<Role>
  {
    return this.http.put<Role>(`${this.globals.baseUrl}/role`, { role }).pipe(
      tap(results => console.log(`Created role `)),
      catchError(this.errorService.handleError('Update Role'))
    )
  }

  createNestedRole(role_id: number, role_nested_id: number) : Observable <NestedRole> {
    let nested_role = { role_id, role_nested_id }
    return this.http.post<NestedRole>(`${this.globals.baseUrl}/role/nest`, { nested_role }).pipe(
      tap(results => console.log(`Created role `)),
      catchError(this.errorService.handleError('Create Nested Role'))
    )
  }

  removeNestedRole(nested: NestedRole) : Observable <StatusMessage> {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/role/nest/${nested.id}`).pipe(
      tap(results => console.log(`Created role `)),
      catchError(this.errorService.handleError('Create Nested Role'))
    )
  }
}
