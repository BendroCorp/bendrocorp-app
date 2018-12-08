import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingCourse } from '../models/training-models';
import { TrainingService } from './training.service';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { User } from '../models/user-models';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  trainingCourses: TrainingCourse[] = []
  instructors: User[] = []
  subscription: Subscription
  isAdmin: boolean = this.authService.hasClaim(35)

  constructor(private trainingService: TrainingService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private spinnerService: SpinnerService) {
      this.subscription = this.trainingService.dataRefreshAnnounced$.subscribe(
        () => {
          this.fetchCourses()
        }
      )
    }

  openCourse(course: TrainingCourse) {
    this.router.navigateByUrl(`/training/${course.id}`)
  }

  publishCourse(course: TrainingCourse) {
    if (course && course.id && this.isAdmin) {
      if (confirm("Are you sure you want to publish this course?")) {
        course.draft = false
        this.trainingService.updateCourse(course).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.trainingService.refreshData()
            }else{
              course.draft = true
            }
          }
        )
      }
    }
  }

  userCompleted(course: TrainingCourse) {
    if (course.training_course_completions) {
      return (course.training_course_completions.filter(x => x.user_id === this.authService.retrieveUserSession().id && x.version == course.version).length > 0)
    }else{
      return false
    }    
  }

  fetchCourses() {
    this.trainingService.listCourses().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.trainingCourses = results
        }
        this.spinnerService.spin(false)
      }
    )
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.trainingService.fetchInstructors().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.instructors = results
        }
      }
    )
    this.fetchCourses()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
