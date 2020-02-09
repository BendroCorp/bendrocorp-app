import { Injectable } from '@angular/core';
import { Field, FieldDescriptor, FieldDescriptorClass } from '@bendrocorp/bendrocorp-node-sdk/models/field.model';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Observable, Subject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { StatusMessage } from '../models/misc-models';

@Injectable({
  providedIn: 'root'
})
export class FieldService {

  constructor(private http: HttpClient, private messageService: MessageService, private errorService: ErrorService, private globals: Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();

  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Field service data refresh called!");    
    this.dataRefreshSource.next();
  }

  /**
   * Fetch all fields with thier descriptors
   */
  listFields(): Observable<Field[]> {
    return this.http.get<Field[]>(`${this.globals.baseUrl}/fields`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Fields'))
    );
  };

  /**
   * Fetch all the descriptors for a given field.
   * @param fieldId Field GUID you want to fetch descriptors for.
   */
  getField(fieldId: string): Observable<FieldDescriptor[]> {
    return this.http.get<FieldDescriptor[]>(`${this.globals.baseUrl}/fields/${fieldId}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  getFieldDetails(fieldId: string): Observable<FieldDescriptor> {
    return this.http.get<FieldDescriptor>(`${this.globals.baseUrl}/fields/${fieldId}/details`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field Details'))
    );
  }

  addField(field: Field): Observable<Field> {
    return this.http.post<Field>(`${this.globals.baseUrl}/fields`, { field }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Add Field'))
    );
  }

  updateField(field: Field): Observable<Field> {
    return this.http.put<Field>(`${this.globals.baseUrl}/fields`, { field }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  archiveField(field: Field): Observable<StatusMessage> {
    return this.http.get<StatusMessage>(`${this.globals.baseUrl}/fields/${field.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  addDescriptor(descriptor: FieldDescriptor): Observable<FieldDescriptor> {
    return this.http.post<FieldDescriptor>(`${this.globals.baseUrl}/fields/descriptor`, { descriptor }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  updateDescriptor(descriptor: FieldDescriptor) {
    return this.http.put<FieldDescriptor>(`${this.globals.baseUrl}/fields/descriptor`, { descriptor }).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Update Field'))
    );
  }

  archiveDescriptor(descriptor: FieldDescriptor) {
    return this.http.delete<FieldDescriptor[]>(`${this.globals.baseUrl}/fields/descriptor/${descriptor.id}`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }

  getFieldDescriptorClasses(): Observable<FieldDescriptorClass[]> {
    return this.http.get<FieldDescriptorClass[]>(`${this.globals.baseUrl}/fields/classes`).pipe(
      tap(results => console.log(results)),
      catchError(this.errorService.handleError<any>('Fetch Field'))
    );
  }
}
