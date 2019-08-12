import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestsService } from '../requests.service';
import { MyApproval } from '../../models/approval-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { ActivatedRoute } from '../../../../node_modules/@angular/router';
import { Subscription } from '../../../../node_modules/rxjs';
import { SpinnerService } from '../../misc/spinner/spinner.service';
import { AuthService } from 'src/app/auth.service';
import { ConfirmationModal } from 'src/app/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-approval-details',
  templateUrl: './approval-details.component.html',
  styleUrls: ['./approval-details.component.css']
})
export class ApprovalDetailsComponent implements OnInit, OnDestroy {  
  approval:MyApproval;
  approvalId:number = parseInt(this.route.snapshot.paramMap.get('approval_id'));
  approvalSubmitting:boolean = false;
  dataLoaded:boolean = false;
  subscription:Subscription;
  isCeo: boolean = this.authService.hasClaim(9);

  constructor(
    private requestsService:RequestsService,
    private route:ActivatedRoute,
    private spinnerService:SpinnerService,
    private authService: AuthService,
    private confirmationModal: ConfirmationModal
  ) { 
    this.subscription = this.requestsService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchApproval()
      }
    )
  }

  fetchApproval() {
    this.requestsService.list_approvals().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.approval = results.find(x => x.approval_id == this.approvalId)
          console.log(this.approval);          
          this.dataLoaded = true
          this.spinnerService.spin(false)
        }
      }
    )
  }

  async removeApprover(approver_id: number) {
    if (approver_id) {
      if (await this.confirmationModal.open('Are you sure you want remove this approver? This will set their status to not needed and override any previous approval type. (CEO ONLY)')) {
        this.requestsService.remove_approver(approver_id).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.fetchApproval();
          }
        });
      }
    }
  }

  async submitApproval(approvalId:number, typeId:number) {
    let appDen:string = "..."
    if (typeId === 4) {
      appDen = "approve"
    }

    if (typeId == 5) {
      appDen = "deny"
    }
    if (await this.confirmationModal.open(`Are you sure you want to ${appDen} approval #${approvalId}?`)) {
      this.approvalSubmitting = true
      this.requestsService.submit_approval(approvalId, typeId).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse))
          {
            this.fetchApproval()
          }
          this.approvalSubmitting = false
        }
      )
    }
  }

  approvalCompleted() {
    if (this.approval) {
      const completed = (this.approval.approval.approved || this.approval.approval.denied) ? true : false;     
      return completed;
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.fetchApproval()
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
