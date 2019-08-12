import { Component, OnInit, Input } from '@angular/core';
import { MyApproval } from '../../models/approval-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { RequestsService } from '../requests.service';
import { ConfirmationModal } from 'src/app/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'approval-control',
  templateUrl: './approval-control.component.html',
  styleUrls: ['./approval-control.component.css']
})
export class ApprovalControlComponent implements OnInit {
  @Input() approval:MyApproval
  approvalSubmitting:boolean = false
  constructor(private requestsService:RequestsService, private confirmationModal: ConfirmationModal) { }

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
            this.requestsService.refreshData()
          }
          this.approvalSubmitting = false
        }
      )
    }
  }

  approvalCompleted() {
    if (this.approval) {
      return (this.approval.approval.approved || this.approval.approval.denied) ? true : false;
    }
  }

  ngOnInit() {
  }

}
