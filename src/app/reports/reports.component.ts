import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
// import { AuthClient, ReportResource } from '@bendrocorp/bendrocorp-node-sdk';
import { Report, ReportField, ReportFieldValue, ReportTemplate } from '@bendrocorp/bendrocorp-node-sdk/models/report.model'

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  isReportBuilder: boolean = this.authService.hasClaim(48);
  isReportAdmin: boolean = this.authService.hasClaim(49);
  reports: Report[];

  constructor(private authService: AuthService) { }

  fetchReports() {
    // let authClient = new AuthClient();
    // authClient.setCredentials({ access_token: this.authService.retrieveSession() })

    // new ReportResource({ auth: authClient }).list({ type: 'reports' }).subscribe((results) => {
    //   // this.reports = results as Report[] // we have to cast it
    // }, (error) => {
    //   // we need to play with error handling and how that will work with the SDK and probably make adjustment to it
    // })
  }

  ngOnInit() {
  }

}
