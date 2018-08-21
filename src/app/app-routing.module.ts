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

const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'profiles', component: ProfilesComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'profiles/:character_id', component: ProfileDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'events', component: EventsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'events/:event_id', component: EventDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    // public/non-member routes below here
    { path: 'login', component: LoginComponent, canActivate: [NoAuthGuardService] },
    { path: 'signup', component: SignupComponent, canActivate: [NoAuthGuardService] },
    { path: 'apply', component: MemberApplicationComponent, canActivate: [AuthGuardService] },
    // Keep requests at the bottom of the route list
    { path: 'requests', component: RequestsComponent, canActivate: [AuthGuardService, MemberAuthGuardService] },
    { path: 'requests/approvals', component: ApprovalsComponent, canActivate: [AuthGuardService, MemberAuthGuardService]},
    { path: 'requests/approvals/:approval_id', component: ApprovalDetailsComponent, canActivate: [AuthGuardService, MemberAuthGuardService]}
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