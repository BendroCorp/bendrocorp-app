import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSessionResponse } from '../models/user-models';
import { AuthService } from '../auth.service';
import { Subscription } from '../../../node_modules/rxjs';
import { ErrorService } from '../error.service';
import { Router } from '../../../node_modules/@angular/router';
import { TrainingService } from '../training/training.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSession:UserSessionResponse
  authSubscription:Subscription
  authErrorSubscription:Subscription
  trainingSubscription:Subscription
  isMember:boolean = this.authService.hasClaim(0)
  alertCount: number = 0
  trainingCount: number = 0

  constructor(private authService:AuthService, private traininingService: TrainingService, private errorService:ErrorService, private router:Router) { 
    this.authSubscription = this.authService.dataRefreshAnnounced$.subscribe(
      () =>
      {
        console.log("Menu observed auth service call!");
        this.fetchUserSession()
        this.isMember = this.authService.hasClaim(0)
      }
    )

    this.authErrorSubscription = this.errorService.authErrorAnnounced$.subscribe(
      called => {
        console.log("Menu observed auth service call!");
        this.fetchUserSession()
        this.isMember = this.authService.hasClaim(0)
      }
    )

    this.trainingSubscription = this.traininingService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchTrainingCount()
      }
    )
  }

  doLogout()
  {
    this.authService.logout().subscribe(
      () => {
        let done = this.router.navigateByUrl('/').then((results) => {
          console.log(results)
          if (results == null) {
            location.reload()
          }
        }).catch((derp) => {
          console.log(derp)
          
        })
      }
    )    
  }

  fetchUserSession()
  {
    if (this.authService.isLoggedIn()) {
      this.userSession = this.authService.retrieveUserSession()
    } else {
      this.userSession = null
    }
  }

  fetchTrainingCount() {
    if (this.authService.isLoggedIn() && this.isMember) {
      this.traininingService.listCourses().subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            let todo = 0
            results.filter(x => !x.draft).forEach((course) => {
              if (course.training_course_completions.filter(x => x.version == course.version && x.user_id === (this.authService.retrieveUserSession() as UserSessionResponse).id).length == 0) {
                todo += 1
              }
            })
            
            // assign stuff
            this.trainingCount = todo
            this.alertCount = todo // future use in case we add multiple alertable items
          }
        }
      )
    }
  }

  ngOnInit() {
    this.fetchUserSession()
    this.fetchTrainingCount()
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe()
    this.authErrorSubscription.unsubscribe()
  }

}
