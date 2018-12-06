import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService, NoAuthGuardService, MemberAuthGuardService } from './auth-guard.service';
import { ProfilesComponent } from './profiles/profiles.component';
import { EventsComponent } from './events/events.component';
import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './misc/not-found/not-found.component';
import { EventDetailsComponent } from './events/event-details/event-details.component';
import { RequestsComponent } from './requests/requests.component';
import { ApprovalsComponent } from './requests/approvals/approvals.component';
import { ApprovalDetailsComponent } from './requests/approval-details/approval-details.component';
import { ProfileDetailsComponent } from './profiles/profile-details/profile-details.component';
import { MemberApplicationComponent } from './member-application/member-application.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { FlightLogsComponent } from './flight-logs/flight-logs.component';
import { FlightLogDetailsComponent } from './flight-logs/flight-log-details/flight-log-details.component';
import { OffenderReportsComponent } from './offender-reports/offender-reports.component';
import { AddRoleComponent } from './requests/add-role/add-role.component';
import { RemoveRoleComponent } from './requests/remove-role/remove-role.component';
import { PositionChangeComponent } from './requests/position-change/position-change.component';
import { OauthComponent } from './oauth/oauth.component';
import { AuthCompleteComponent } from './misc/auth-complete/auth-complete.component';
import { SystemMapComponent } from './system-map/system-map.component';
import { ImpersonateComponent } from './admin/impersonate/impersonate.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OffenderDetailsComponent } from './offender-reports/offender-details/offender-details.component';
import { OffenderReportReportDetailsComponent } from './offender-reports/offender-report-report-details/offender-report-report-details.component';
import { SiteLogsComponent } from './site-logs/site-logs.component';
import { DonationsComponent } from './donations/donations.component';
import { TrainingComponent } from './training/training.component';
import { TrainingCourseDetailsComponent } from './training/training-course-details/training-course-details.component'

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'profiles', component: ProfilesComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'profiles/:character_id', component: ProfileDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'events', component: EventsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'events/:event_id', component: EventDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'job-board', component: JobBoardComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'flight-logs', component: FlightLogsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'flight-logs/:flight_log_id', component: FlightLogDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'offender-reports', component: OffenderReportsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'system-map', component: SystemMapComponent, canActivate: [AuthGuardService, MemberAuthGuardService]},
    { path: 'offender-reports/:offender_id', component: OffenderDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'offender-reports/report/:report_id', component: OffenderReportReportDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'site-logs', component: SiteLogsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'funding', component: DonationsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'training', component: TrainingComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'training/:course_id', component: TrainingCourseDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    // public/non-member routes below here
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuardService] },
    { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuardService] },
    { path: 'apply', component: MemberApplicationComponent, canActivate: [AuthGuardService] },
    // Keep requests at the bottom of the route list
    { path: 'requests', component: RequestsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'requests/add-role', component: AddRoleComponent, canActivate: [AuthGuardService, MemberAuthGuardService]},
    { path: 'requests/remove-role', component: RemoveRoleComponent, canActivate: [AuthGuardService, MemberAuthGuardService]},
    { path: 'requests/position-change', component: PositionChangeComponent, canActivate: [AuthGuardService, MemberAuthGuardService]},
    { path: 'requests/approvals', component: ApprovalsComponent, canActivate: [AuthGuardService, MemberAuthGuardService]},
    { path: 'requests/approvals/:approval_id', component: ApprovalDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService]},
    { path: 'oauth', component: OauthComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'auth-complete', component: AuthCompleteComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'impersonate', component: ImpersonateComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [NoAuthGuardService] },
    { path: 'password-reset/:token', component: ResetPasswordComponent, canActivate: [NoAuthGuardService] },
  ];
  
  @NgModule({
    imports: [ 
        RouterModule.forRoot(routes), // general route provider
        RouterModule.forChild([ // catch all our mistakes route provider
        {
            path: '**',
            component: NotFoundComponent
        }
      ]) ],
    exports: [ RouterModule ]
  })
  export class AppRoutingModule {}