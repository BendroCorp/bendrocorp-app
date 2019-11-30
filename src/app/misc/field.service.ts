import { Injectable } from '@angular/core';
import { Field } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(private http: HttpClient, private messageService: MessageService, private errorService: ErrorService, private globals: Globals) { }

  listFields(): Observable<Field[]> {
    return this.http.get<Field[]>(`${this.globals.baseUrl}/fields`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Fields'))
    );
  }
}
