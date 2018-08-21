import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserSessionResponse } from '../models/user-models';
import { AuthService } from '../auth.service';
import { Subscription } from '../../../node_modules/rxjs';
import { ErrorService } from '../error.service';
import { Router } from '../../../node_modules/@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSession:UserSessionResponse
  authSubscription:Subscription
  authErrorSubscription:Subscription
  isMember:boolean = this.authService.hasClaim(0)

  constructor(private authService:AuthService, private errorService:ErrorService, private router:Router) { 
    this.authSubscription = this.authService.dataRefreshAnnounced$.subscribe(
      () =>
      {
        console.log("Menu observed auth service call!");
        this.fetchUserSession()
      }
    )

    this.authErrorSubscription = this.errorService.authErrorAnnounced$.subscribe(
      called => {
        console.log("Menu observed auth service call!");
        
        this.fetchUserSession()
      }
    )
  }

  doLogout()
  {
    this.authService.logout().subscribe(
      () => {
        this.router.navigateByUrl('/')
      }
    )    
  }

  fetchUserSession()
  {
    if (this.authService.isLoggedIn()) {
      this.userSession = this.authService.retrieveUserSession()
    } else {
      this.userSession = null
    }
  }

  ngOnInit() {
    this.fetchUserSession()

  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe()
    this.authErrorSubscription.unsubscribe()
  }

}
