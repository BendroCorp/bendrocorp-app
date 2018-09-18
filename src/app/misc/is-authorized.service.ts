import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { interval } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root'
})
export class IsAuthorizedService {

  constructor(private authService:AuthService, private router:Router, private messageService:MessageService) {
    interval(30 * 1000).subscribe(
      () => {
        // Does a token a actually exist?
        let user = this.authService.retrieveUserSession()
        if (user) {
          // if the user is not logged (ie their session has expired)
          if (!this.authService.isLoggedIn()) {
            // then log the user out and redirect to root
            this.authService.logout()
            this.router.navigateByUrl('/')
            this.messageService.addStaticInfo("Your session has expired and you have been logged out.")
          }

          // TODO: Add a warning and possibly a means to extend the active session
        }
      }
    )
  }
}
