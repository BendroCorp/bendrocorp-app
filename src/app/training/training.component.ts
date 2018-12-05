import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingCourse } from '../models/training-models';
import { TrainingService } from './training.service';
import { MessageService } from '../message/message.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  trainingCourses: TrainingCourse[] = []
  subscription: Subscription
  isAdmin: boolean = this.authService.hasClaim(35)

  constructor(private trainingService: TrainingService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService) {
      this.subscription = this.trainingService.dataRefreshAnnounced$.subscribe(
        () => {
          this.fetchCourses()
        }
      )
    }

  openCourse(course: TrainingCourse) {
    this.router.navigateByUrl(`/training/${course.id}`)
  }

  userCompleted(course: TrainingCourse) {
    return (course.training_course_completions.filter(x => x.user_id === this.authService.retrieveUserSession().id).length > 0)
  }

  fetchCourses() {
    this.trainingService.listCourses().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.trainingCourses = results
        }
      }
    )
  }

  ngOnInit() {
    this.fetchCourses()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
