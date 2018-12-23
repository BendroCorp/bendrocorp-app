import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestsService } from '../requests.service';
import { MyApproval } from '../../models/approval-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { Subscription } from '../../../../node_modules/rxjs';
import { SpinnerService } from '../../misc/spinner/spinner.service';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.css']
})
export class ApprovalsComponent implements OnInit, OnDestroy {
  
  myApprovals:MyApproval[] = []
  readonly showItems:number = 10
  approvalSubmitting:boolean = false
  subscription:Subscription
  dofetchAll:boolean = false
  constructor(private requestsService:RequestsService, private spinnerService:SpinnerService) { 
    this.subscription = requestsService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchApprovals()
      }
    )
  }

  fetchApprovals() {
    this.spinnerService.spin(true)
    let count = (this.dofetchAll) ? null : this.showItems
    console.log(count)
    
    this.requestsService.list_approvals(count).subscribe(
      (results) => {
        this.spinnerService.spin(false)
        if (!(results instanceof HttpErrorResponse)) {
          this.myApprovals = results
        }
      }
    )
  }

  fetchAll() {
    this.dofetchAll = true
    this.fetchApprovals()
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.fetchApprovals()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
