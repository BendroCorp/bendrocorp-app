import { Component, OnInit, OnDestroy } from '@angular/core';
import { JobsService } from './jobs.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { Job } from '../models/character-models';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.css']
})
export class JobsComponent implements OnInit, OnDestroy {
  jobs:Job[]
  subscription: Subscription
  dataLoaded: boolean
  allowedAccess: boolean = this.authService.hasClaim(38)

  constructor(private jobService:JobsService, private authService: AuthService, private router: Router, private messageService: MessageService, private spinnerService:SpinnerService) {
    this.subscription = this.jobService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchJobs()
      }
    )
  }

  fetchJobs() {
    this.jobService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.jobs = results.sort((a,b) => {
            return a.id - b.id
          })
          this.dataLoaded = true
        }
      }
    )
  }

  ngOnInit() {
    if (this.allowedAccess) {
      this.spinnerService.spin(true)
      this.fetchJobs()
    } else {
      console.error('You do not have permission to access jobs.')
      this.messageService.addError('You do not have permission to access this page.')
      this.router.navigateByUrl('/')
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
