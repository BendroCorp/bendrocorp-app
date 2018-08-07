import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Observable } from '../../../node_modules/rxjs';
import { MenuItem } from '../models/misc-models';
import { tap, catchError } from '../../../node_modules/rxjs/operators';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http:HttpClient, private messageService:MessageService, private errorService:ErrorService, private globals:Globals) { }

  list() : Observable<MenuItem[]>
  {
    return this.http.get<MenuItem[]>(`${this.globals.baseUrl}/menu`).pipe(
      tap(results => console.log()),
      catchError(this.errorService.handleError('Fetch Menu', []))
    )
  }
}
