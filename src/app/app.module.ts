import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModal, NgbModule, NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { DlDateTimePickerDateModule } from 'angular-bootstrap-datetimepicker';

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
import { AuthGuardService, NoAuthGuardService, MemberAuthGuardService } from './auth-guard.service';
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
import { InlineEditorComponent } from './editors/inline-editor/inline-editor.component';
import { TextareaEditorComponent } from './editors/textarea-editor/textarea-editor.component';
import { ApplicationInterviewComponent } from './profiles/application-interview/application-interview.component';
import { ApplicationDetailsComponent } from './profiles/application-details/application-details.component';
import { EditJobModalComponent } from './job-board/edit-job-modal/edit-job-modal.component';
import { CompleteJobModalComponent } from './job-board/complete-job-modal/complete-job-modal.component';
import { ViewJobModalComponent } from './job-board/view-job-modal/view-job-modal.component';
import { FlightLogDetailsComponent } from './flight-logs/flight-log-details/flight-log-details.component';
import { CreateUpdateFlightLogModalComponent } from './flight-logs/create-update-flight-log-modal/create-update-flight-log-modal.component';
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPaginationModule } from 'ngx-pagination';
import { CreateUpdateOffenderReportModalComponent } from './offender-reports/create-update-offender-report-modal/create-update-offender-report-modal.component';
import { LocationSwitcherComponent } from './helpers/location-switcher/location-switcher.component';
import { OffenderReportDetailsComponent } from './offender-reports/offender-report-details/offender-report-details.component';
import { OrderByPipe } from './helpers/orderBy';
import { FilterPipe } from './pipes/filter.pipe';
import { SpinnerComponent } from './misc/spinner/spinner.component';
import { SpinnerService } from './misc/spinner/spinner.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PromptUpdateService } from './updates/prompt-update-service.service';
import { CheckForUpdateService } from './updates/check-for-update.service';
import { LogUpdateService } from './updates/log-update-service.service';
import { ApiOfflineComponent } from './misc/api-offline/api-offline.component';
import { IsAuthorizedService } from './misc/is-authorized.service';
import { OauthComponent } from './oauth/oauth.component';
// import { DeviceDetectorModule } from 'ngx-device-detector';
import { AuthCompleteComponent } from './misc/auth-complete/auth-complete.component';
import { StarChartComponent } from './system-map/star-chart/star-chart.component';
import { AddUpdateSystemModalComponent } from './system-map/add-update-system-modal/add-update-system-modal.component';
import { AddUpdatePlanetModalComponent } from './system-map/add-update-planet-modal/add-update-planet-modal.component';
import { AddUpdateMoonModalComponent } from './system-map/add-update-moon-modal/add-update-moon-modal.component';
import { AddUpdateSystemObjectModalComponent } from './system-map/add-update-system-object-modal/add-update-system-object-modal.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { ImpersonateComponent } from './admin/impersonate/impersonate.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { OffenderDetailsComponent } from './offender-reports/offender-details/offender-details.component';
import { OffenderReportReportDetailsComponent } from './offender-reports/offender-report-report-details/offender-report-report-details.component';
import { AddUpdateLocationModalComponent } from './system-map/add-update-location-modal/add-update-location-modal.component';
import { AddUpdateSettlementModalComponent } from './system-map/add-update-settlement-modal/add-update-settlement-modal.component';
import { AddUpdateSystemImageModalComponent } from './system-map/add-update-system-image-modal/add-update-system-image-modal.component';
import { ImageViewModalComponent } from './image-view-modal/image-view-modal.component';
import { SystemRatingPanelComponent } from './system-map/system-rating-panel/system-rating-panel.component';
import { ApplicationRejectionModalComponent } from './profiles/application-rejection-modal/application-rejection-modal.component';
import { SiteLogsComponent } from './site-logs/site-logs.component';
import { SiteLogDetailsModalComponent } from './site-logs/site-log-details-modal/site-log-details-modal.component';
import { DonationsComponent } from './donations/donations.component';
import { MakeDonationModalComponent, DonationModalContent } from './donations/make-donation-modal/make-donation-modal.component';
import { CreateUpdateDonationModalComponent } from './donations/create-update-donation-modal/create-update-donation-modal.component';
import { TrainingComponent } from './training/training.component';
import { TrainingCourseDetailsComponent } from './training/training-course-details/training-course-details.component';
import { TrainingCourseCreateUpdateModalComponent } from './training/training-course-create-update-modal/training-course-create-update-modal.component';
import { TrainingItemCreateUpdateModalComponent } from './training/training-item-create-update-modal/training-item-create-update-modal.component';
import { TrainingItemComponent } from './training/training-item/training-item.component';
import { SafeResourcePipe } from './pipes/safe-resource.pipe';
import { SortablejsModule } from 'angular-sortablejs';
import { RolesComponent } from './roles/roles.component';
import { JobsComponent } from './jobs/jobs.component';
import { CreateUpdateJobModalComponent } from './jobs/create-update-job-modal/create-update-job-modal.component';
import { LiabilitiesComponent } from './liabilities/liabilities.component';
import { LawLibraryComponent } from './law-library/law-library.component';
import { LawLibraryDetailsComponent } from './law-library/law-library-details/law-library-details.component';
import { SelectEditorComponent } from './editors/select-editor/select-editor.component';
import { DisplayFieldNameFilter, DisplayNameFilter } from './pipes/display-value.pipe';
import { ConfirmationModal, ConfirmationModalContent } from './modals/confirmation-modal/confirmation-modal.component';
import { SystemLawModalComponent } from './system-map/system-law-modal/system-law-modal.component';
import { ActionCableService, Channel } from 'angular2-actioncable';
import { NewsComponent } from './news/news.component';
import { NewsAddUpdateModalComponent } from './news/news-add-update-modal/news-add-update-modal.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { DiscordComponent } from './header/discord/discord.component';
import { DiscordCallbackComponent } from './header/discord/discord-callback/discord-callback.component';
import { TemplatesComponent } from './reports/templates/templates.component';
import { ReportDetailsComponent } from './reports/report-details/report-details.component';
import { TemplateEditorComponent } from './reports/templates/template-editor/template-editor.component';
import { AddReportComponent } from './reports/add-report/add-report.component';
import { SystemMapMapViewComponent } from './system-map/system-map-map-view/system-map-map-view.component';
import { SystemMapListViewComponent } from './system-map/system-map-list-view/system-map-list-view.component';
import { AddUpdateMissionGiverModalComponent } from './system-map/add-update-mission-giver-modal/add-update-mission-giver-modal.component';
import { FactionAdminComponent } from './faction-admin/faction-admin.component';
import { AddUpdateFactionModalComponent } from './faction-admin/add-update-faction-modal/add-update-faction-modal.component';
import { AddUpdateJumpPointModalComponent } from './system-map/add-update-jump-point-modal/add-update-jump-point-modal.component';
import { ViewJumpPointModal, ViewJumpPointModalContent } from './system-map/view-jump-point-modal/view-jump-point-modal.component';
import { AddUpdateGravityWellModalComponent } from './system-map/add-update-gravity-well-modal/add-update-gravity-well-modal.component';
import { AngularResizedEventModule } from 'angular-resize-event';
import { SystemMapTagComponent } from './system-map/system-map-tag/system-map-tag.component';
import { SystemMapObjectDetailComponent } from './system-map/system-map-object-detail/system-map-object-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderByPipe,
    FilterPipe,
    DisplayFieldNameFilter,
    DisplayNameFilter,
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
    ProfileDetailsComponent,
    InlineEditorComponent,
    TextareaEditorComponent,
    ApplicationInterviewComponent,
    ApplicationDetailsComponent,
    EditJobModalComponent,
    CompleteJobModalComponent,
    ViewJobModalComponent,
    FlightLogDetailsComponent,
    CreateUpdateFlightLogModalComponent,
    CreateUpdateOffenderReportModalComponent,
    LocationSwitcherComponent,
    OffenderReportDetailsComponent,
    SpinnerComponent,
    ApiOfflineComponent,
    OauthComponent,
    AuthCompleteComponent,
    StarChartComponent,
    AddUpdateSystemModalComponent,
    AddUpdatePlanetModalComponent,
    AddUpdateMoonModalComponent,
    AddUpdateSystemObjectModalComponent,
    TermsOfServiceComponent,
    PrivacyComponent,
    ImpersonateComponent,
    ResetPasswordComponent,
    OffenderDetailsComponent,
    OffenderReportReportDetailsComponent,
    AddUpdateLocationModalComponent,
    AddUpdateSettlementModalComponent,
    AddUpdateSystemImageModalComponent,
    ImageViewModalComponent,
    SystemRatingPanelComponent,
    ApplicationRejectionModalComponent,
    SiteLogsComponent,
    SiteLogDetailsModalComponent,
    DonationsComponent,
    MakeDonationModalComponent,
    CreateUpdateDonationModalComponent,
    DonationModalContent,
    TrainingComponent,
    TrainingCourseDetailsComponent,
    TrainingCourseCreateUpdateModalComponent,
    TrainingItemCreateUpdateModalComponent,
    TrainingItemComponent,
    SafeResourcePipe,
    RolesComponent,
    JobsComponent,
    CreateUpdateJobModalComponent,
    LiabilitiesComponent,
    LawLibraryComponent,
    LawLibraryDetailsComponent,
    SelectEditorComponent,
    ConfirmationModal,
    ConfirmationModalContent,
    SystemLawModalComponent,
    NewsComponent,
    NewsAddUpdateModalComponent,
    NewsDetailComponent,
    DiscordComponent,
    DiscordCallbackComponent,
    TemplatesComponent,
    ReportDetailsComponent,
    TemplateEditorComponent,
    AddReportComponent,
    SystemMapMapViewComponent,
    SystemMapListViewComponent,
    AddUpdateMissionGiverModalComponent,
    FactionAdminComponent,
    AddUpdateFactionModalComponent,
    AddUpdateJumpPointModalComponent,
    ViewJumpPointModal,
    ViewJumpPointModalContent,
    AddUpdateGravityWellModalComponent,
    SystemMapTagComponent,
    SystemMapObjectDetailComponent,
  ],
  entryComponents: [
    EventModalComponent,
    UpdateEventBriefingModalComponent,
    UpdateEventDebriefingModalComponent,
    EventCertificationModalComponent,
    DonationModalContent,
    ConfirmationModalContent,
    ViewJumpPointModalContent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule, //.forRoot(),
    BrowserAnimationsModule,
    AngularDateTimePickerModule,
    DlDateTimePickerDateModule,
    QRCodeModule,
    NgxPaginationModule,
    // DeviceDetectorModule.forRoot(),
    SortablejsModule,
    SortablejsModule.forRoot({ animation: 150 }),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    AngularResizedEventModule,
  ],
  providers: [
    PromptUpdateService,
    CheckForUpdateService,
    LogUpdateService,
    OrderByPipe,
    FilterPipe,
    DisplayFieldNameFilter,
    DisplayNameFilter,
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
    MemberAuthGuardService,
    NoAuthGuardService,
    ErrorService,
    MessageService,
    MenuService,
    Globals,
    EventService,
    SpinnerService,
    IsAuthorizedService,
    ConfirmationModal,
    ViewJumpPointModal,
    // ActionCableService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
