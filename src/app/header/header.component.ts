import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSessionResponse } from '../models/user-models';
import { AuthService } from '../auth.service';
import { Subscription } from '../../../node_modules/rxjs';
import { ErrorService } from '../error.service';
import { Router } from '../../../node_modules/@angular/router';
import { TrainingService } from '../training/training.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RequestsService } from '../requests/requests.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSession: UserSessionResponse;
  authSubscription: Subscription;
  authErrorSubscription: Subscription;
  trainingSubscription: Subscription;
  requestsSubscription: Subscription;
  isMember: boolean = this.authService.hasClaim(0);
  approvalsCount: number = 0;
  alertCount: number = 0;
  trainingCount: number = 0;

  constructor(
    private authService:AuthService,
    private traininingService: TrainingService,
    private requestsService: RequestsService,
    private userService: UserService,
    private errorService:ErrorService,
    private router:Router
  ) { 
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

    this.requestsSubscription = this.requestsService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchApprovalCount();
    });
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
      this.userSession = this.authService.retrieveUserSession();
      console.log(this.userSession);
      
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
            results.filter(x => !x.draft && x.required).forEach((course) => {
              if (course.training_course_completions.filter(x => x.version == course.version && x.user_id === (this.authService.retrieveUserSession() as UserSessionResponse).id).length == 0) {
                todo += 1
              }
            })
            
            // assign stuff
            this.trainingCount = todo
            this.alertCount = this.trainingCount + this.approvalsCount;  // future use in case we add multiple alertable items
          }
        }
      )
    }
  }

  fetchApprovalCount() {
    this.userService.remaining_approval_count().subscribe((results) => {
      this.approvalsCount = results;
      this.alertCount = this.trainingCount + this.approvalsCount;
    });
  }

  ngOnInit() {
    this.fetchUserSession();
    this.fetchTrainingCount();
    this.fetchApprovalCount();
  }

  ngOnDestroy() {    
    if (this.authErrorSubscription) {
      this.authErrorSubscription.unsubscribe();
    }

    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }

    if (this.requestsSubscription) {
      this.requestsSubscription.unsubscribe();
    }
  }

}
