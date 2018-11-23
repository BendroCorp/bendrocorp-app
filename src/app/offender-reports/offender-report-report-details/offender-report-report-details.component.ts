import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OffenderReportService } from '../offender-report.service';
import { AuthService } from 'src/app/auth.service';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { OffenderReport } from 'src/app/models/offender-report-models';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'src/app/message/message.service';

@Component({
  selector: 'app-offender-report-report-details',
  templateUrl: './offender-report-report-details.component.html',
  styleUrls: ['./offender-report-report-details.component.css']
})
export class OffenderReportReportDetailsComponent implements OnInit {
  reportId:number
  offenderReport:OffenderReport
  constructor(private route:ActivatedRoute, private router:Router, private offenderService:OffenderReportService, private authService:AuthService, private messageService:MessageService, private spinnerService:SpinnerService) { }

  fetchOffenderReport()
  {
    this.offenderService.fetch_report(this.reportId).subscribe(
      (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          console.log(result)
          this.offenderReport = result
        }else{
          this.messageService.addError("Report does not exist or you are not authorized to view it.")
          this.router.navigateByUrl(`/offender-reports`)
        }
        this.spinnerService.spin(false)
      }
    )
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.reportId = parseInt(this.route.snapshot.paramMap.get("report_id"))
    this.fetchOffenderReport()
  }

}
