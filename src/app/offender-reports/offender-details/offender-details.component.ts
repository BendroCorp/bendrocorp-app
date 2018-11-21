import { Component, OnInit } from '@angular/core';
import { SpinnerService } from 'src/app/misc/spinner/spinner.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Offender } from 'src/app/models/offender-report-models';
import { Observable, of } from 'rxjs';
import { OffenderReportService } from '../offender-report.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-offender-details',
  templateUrl: './offender-details.component.html',
  styleUrls: ['./offender-details.component.css']
})
export class OffenderDetailsComponent implements OnInit {
  offenderId:number
  offender:Offender
  offenderInfractionHistogram:{}
  constructor(private route:ActivatedRoute, private router:Router, private offenderService:OffenderReportService, private authService:AuthService, private spinnerService:SpinnerService) { }

  fetchOffender()
  {
    this.offenderService.fetch_offender(this.offenderId).subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log(results)
          this.offender = results
          
          let infractionsHistogram = {}
          
          this.offender.offender_reports
          .map(x => x.infractions)
          .reduce((acc, val) => acc.concat(val), [])
          .map(x => x.title).forEach((title) => {
            if (infractionsHistogram[title]) 
            {
              infractionsHistogram[title] += 1
            }else{
              infractionsHistogram[title] = 1
            }
          })

          console.log(infractionsHistogram);
          this.offenderInfractionHistogram = infractionsHistogram
        }else{
          console.error(results);
          
        }
        this.spinnerService.spin(false)
      }
    )
  }

  openReport(reportId:number)
  {
    this.router.navigateByUrl(`/offender-reports/report/${reportId}`)
  }

  fetchOrgAssociatesString()
  {
    if (this.offender && this.offender.id && this.offender.offender_report_org) {
      let filtered = this.offender.offender_report_org.known_offenders.filter(x => x.id != this.offender.id)
      return (filtered.length > 0) ? filtered.join(', ') : "None"
    }else{
      return "None"
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.offenderId = parseInt(this.route.snapshot.paramMap.get("offender_id").split('-')[1])
    this.fetchOffender()
  }

}
