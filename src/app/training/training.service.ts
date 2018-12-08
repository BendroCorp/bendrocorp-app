import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { TrainingCourse, TrainingItem, TrainingItemCompletion, TrainingCourseCompletion, TrainingItemType, MemberBadge } from '../models/training-models';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user-models';

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
      catchError(this.errorService.handleError<any>('Create Training Item'))
    )
  }

  updateTrainingItem(training_item: TrainingItem) {
    return this.http.put<TrainingItem>(`${this.globals.baseUrl}/training/item`, { training_item }).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Update Training Item'))
    )
  }

  archiveTrainingItem(training_item: TrainingItem) {
    return this.http.delete<TrainingItem>(`${this.globals.baseUrl}/training/item/${training_item.id}`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Archive Training Item'))
    )
  }

  completeTraining(training_item: TrainingItem): Observable<TrainingItemCompletion|TrainingCourseCompletion> {
    let training_item_completion = { training_item_id: training_item.id } as TrainingItemCompletion
    return this.http
    .post<TrainingItemCompletion|TrainingCourseCompletion>(`${this.globals.baseUrl}/training/item/complete`, { training_item_completion })
    .pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('Complete Training Item'))
    )
  }

  fetchTypes(): Observable<TrainingItemType[]> {
    return this.http.get<TrainingItemType[]>(`${this.globals.baseUrl}/training/types`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('List Training Item Types'))
    )
  }

  fetchBadges(): Observable<MemberBadge[]> {
    return this.http.get<MemberBadge[]>(`${this.globals.baseUrl}/training/badges`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('List Member Badges'))
    )
  }

  fetchInstructors(): Observable<User[]> {
    return this.http.get<User[]>(`${this.globals.baseUrl}/training/instructors`).pipe(
      tap(result => console.log(result)),
      catchError(this.errorService.handleError<any>('List Training Instructors'))
    )
  }
}
