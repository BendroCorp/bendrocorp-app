import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModal, NgbModule, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';

import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { MessageComponent } from './message/message.component';
import { AuthService } from './auth.service';
import { ErrorService } from './error.service';
import { MessageService } from './message/message.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService, NoAuthGuardService, RoleRequiredAuthGuardService } from './auth-guard.service';
import { Globals } from './globals';
import { MenuService } from './menu/menu.service';
import { AuthInterceptor } from './auth-interceptor';
import { ProfilesComponent } from './profiles/profiles.component';
import { EventsComponent } from './events/events.component';
import { JobBoardComponent } from './job-board/job-board.component';
import { FlightLogsComponent } from './flight-logs/flight-logs.component';
import { ReportsComponent } from './reports/reports.component';
import { PagesComponent } from './pages/pages.component';
import { AlertsComponent } from './alerts/alerts.component';
import { OffenderReportsComponent } from './offender-reports/offender-reports.component';
import { CommoditiesComponent } from './commodities/commodities.component';
import { SystemMapComponent } from './system-map/system-map.component';
import { RequestsComponent } from './requests/requests.component';
import { SignupComponent } from './signup/signup.component';
import { NotFoundComponent } from './misc/not-found/not-found.component';
import { RouterModule } from '../../node_modules/@angular/router';
import { CountdownChartComponent } from './dashboard/countdown-chart/countdown-chart.component';
import { EventService } from './events/event.service';
import { EventDetailsComponent } from './events/event-details/event-details.component';
import { EventAttendenceComponent } from './events/event-attendence/event-attendence.component';
import { EventCertificationModalComponent } from './events/event-certification-modal/event-certification-modal.component';
import { EventModalComponent } from './events/event-modal/event-modal.component';
import { UpdateEventBriefingModalComponent } from './events/update-event-briefing-modal/update-event-briefing-modal.component';
import { UpdateEventDebriefingModalComponent } from './events/update-event-debriefing-modal/update-event-debriefing-modal.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MemberApplicationComponent } from './member-application/member-application.component';
import { SettingsModalComponent } from './settings-modal/settings-modal.component';
import { ApprovalsComponent } from './requests/approvals/approvals.component';
import { AddRoleComponent } from './requests/add-role/add-role.component';
import { RemoveRoleComponent } from './requests/remove-role/remove-role.component';
import { AddAwardComponent } from './requests/add-award/add-award.component';
import { PositionChangeComponent } from './requests/position-change/position-change.component';
import { JobCreationComponent } from './requests/job-creation/job-creation.component';
import { ApprovalDetailsComponent } from './requests/approval-details/approval-details.component';
import { ApprovalControlComponent } from './requests/approval-control/approval-control.component';
import { ProfileDetailsComponent } from './profiles/profile-details/profile-details.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeaderComponent,
    LoginComponent,
    DashboardComponent,
    MessageComponent,
    ProfilesComponent,
    EventsComponent,
    JobBoardComponent,
    FlightLogsComponent,
    ReportsComponent,
    PagesComponent,
    AlertsComponent,
    OffenderReportsComponent,
    CommoditiesComponent,
    SystemMapComponent,
    RequestsComponent,
    SignupComponent,
    NotFoundComponent,
    CountdownChartComponent,
    EventDetailsComponent,
    EventAttendenceComponent,
    EventCertificationModalComponent,
    EventModalComponent,
    UpdateEventBriefingModalComponent,
    UpdateEventDebriefingModalComponent,
    ForgotPasswordComponent,
    MemberApplicationComponent,
    SettingsModalComponent,
    ApprovalsComponent,
    AddRoleComponent,
    RemoveRoleComponent,
    AddAwardComponent,
    PositionChangeComponent,
    JobCreationComponent,
    ApprovalDetailsComponent,
    ApprovalControlComponent,
    ProfileDetailsComponent
  ],
  entryComponents: [
    EventModalComponent,
    UpdateEventBriefingModalComponent,
    UpdateEventDebriefingModalComponent,
    EventCertificationModalComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule.forRoot(),
    BrowserAnimationsModule,
    AngularDateTimePickerModule
  ],
  providers: [
    NgbModal,
    NgbAlert,
    AuthInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    AuthService,
    AuthGuardService,
    NoAuthGuardService,
    RoleRequiredAuthGuardService,
    ErrorService,
    MessageService,
    MenuService,
    Globals,
    EventService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
