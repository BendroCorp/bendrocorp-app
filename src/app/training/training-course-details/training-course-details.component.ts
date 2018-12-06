import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrainingService } from '../training.service';
import { MessageService } from 'src/app/message/message.service';
import { AuthService } from 'src/app/auth.service';
import { TrainingCourse } from 'src/app/models/training-models';
import { Subscription, Observable, of, from } from 'rxjs';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SortablejsOptions } from 'angular-sortablejs/dist';
import { concat, mergeAll, concatAll } from 'rxjs/operators';

@Component({
  selector: 'app-training-course-details',
  templateUrl: './training-course-details.component.html',
  styleUrls: ['./training-course-details.component.css']
})
export class TrainingCourseDetailsComponent implements OnInit, OnDestroy {
  
  courseId: number
  course: TrainingCourse
  isAdmin: boolean = this.authService.hasClaim(35)
  subscription: Subscription
  sortableOptions: SortablejsOptions

  constructor(private route: ActivatedRoute, private router: Router, private traininService: TrainingService, private authService: AuthService, private messageService: MessageService, private spinnerService:SpinnerService) {
    this.subscription = this.traininService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchCourse()
      }
    )
  }

  fetchCourse() {
    if (this.courseId) {
      this.traininService.fetchCourse(this.courseId).subscribe(
        (results) => {
          this.spinnerService.spin(false)
          if (!(results instanceof HttpErrorResponse)) {
            this.course = results
            this.course.training_items = this.course.training_items.sort((a, b) => {
              return a.ordinal - b.ordinal
            })
          } else {
            // this.messageService.addError()
            this.router.navigateByUrl('/training')
          }
        }
      )
    }
  }

  publishCourse() {
    if (this.course && this.course.id && this.isAdmin) {
      if (confirm("Are you sure you want to publish this course?")) {
        this.course.draft = false
        this.traininService.updateCourse(this.course).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.traininService.refreshData()
            }else{
              this.course.draft = true
            }
          }
        )
      }
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.courseId = parseInt(this.route.snapshot.paramMap.get("course_id"))
    this.fetchCourse()    
    // set up everything sorting
    this.sortableOptions = {
      onUpdate: (event: any) => {
        if (this.isAdmin) {
          console.log(`Sortable update occured ${event}`);
          var updateRequests = []
          // REVIEW: This may be very resource intensive - but we have to update all of the ordinals
          for (let index = 0; index < this.course.training_items.length; index++) {
            this.course.training_items[index].ordinal = index + 1
            updateRequests.push(this.traininService.updateTrainingItem(this.course.training_items[index]))
          }
          
          // Run the update requests in order
          from(updateRequests).pipe(concatAll()).subscribe(val => console.log(val))
        }
      }
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
