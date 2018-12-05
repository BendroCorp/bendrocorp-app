import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { TrainingCourse, TrainingItem, TrainingItemCompletion, TrainingCourseCompletion } from '../models/training-models';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private http: HttpClient, private errorService: ErrorService, private globals: Globals) { }

  private dataRefreshSource = new Subject()
  private fullDataRefreshSource = new Subject()
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable()
  fullDataRefreshAnnounced$ = this.fullDataRefreshSource.asObservable()

  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData() {
    console.log('System Map service data refresh called!')
    this.dataRefreshSource.next()
  }

  listCourses(): Observable<TrainingCourse[]> {
    return this.http.get<TrainingCourse[]>(`${this.globals.baseUrl}/training`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('List Training Courses'))
    )
  }

  fetchCourse(course_id: number): Observable<TrainingCourse> {
    return this.http.get<TrainingCourse>(`${this.globals.baseUrl}/training/${course_id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }

  createCourse(training_course: TrainingCourse) {
    return this.http.post<TrainingCourse>(`${this.globals.baseUrl}/training/`, { training_course }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }

  updateCourse(training_course: TrainingCourse) {
    return this.http.put<TrainingCourse>(`${this.globals.baseUrl}/training/`, { training_course }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }

  archiveCourse(training_course: TrainingCourse) {
    return this.http.delete<TrainingCourse>(`${this.globals.baseUrl}/training/${training_course.id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }

  createTrainingItem(training_item: TrainingItem) {
    return this.http.post<TrainingItem>(`${this.globals.baseUrl}/training/item`, { training_item }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }

  updateTrainingItem(training_item: TrainingItem) {
    return this.http.put<TrainingItem>(`${this.globals.baseUrl}/training/item`, { training_item }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }

  archiveTrainingItem(training_item: TrainingItem) {
    return this.http.delete<TrainingItem>(`${this.globals.baseUrl}/training/item/${training_item.id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }

  completeTraining(training_item: TrainingItem): Observable<TrainingItemCompletion|TrainingCourseCompletion> {
    return this.http
    .post<TrainingItemCompletion|TrainingCourseCompletion>(`${this.globals.baseUrl}/training/item/complete`, { training_item })
    .pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Fetch Training Course'))
    )
  }
}
