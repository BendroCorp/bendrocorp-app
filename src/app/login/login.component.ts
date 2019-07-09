import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserSessionResponse, IdTokenResponse } from '../models/user-models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  formEmail:string;
  formPassword:string;
  formCode:string;
  loginSubmitting:boolean = false;

  constructor(private authService: AuthService, private router:Router) { }

  submissionError = "";

  login()
  {
    console.log("Attempting login...");    
    if (this.formEmail && this.formPassword) {
      this.loginSubmitting = true;
      this.authService.login(this.formEmail, this.formPassword, this.formCode).subscribe(
        (result:UserSessionResponse) => {
          console.log(result);                    
          if (!(result instanceof HttpErrorResponse)) {
            var response = result as IdTokenResponse;
            if (response) {
              const token = response.id_token;
              console.log(token);
              this.authService.setSession(token);
              console.log("User is logged in! Yay!!!");
              this.authService.refreshData() // cause anything watching the current user status to refresh

              this.router.navigateByUrl('/');

              // var auth_redirect = this.authService.getOnAuthRedirect()

              // if (auth_redirect && auth_redirect != '/login') {
              //   this.authService.unSetOnAuthRedirect();                
              //   try {
              //     // TODO: Implement this better
              //     this.router.navigateByUrl(auth_redirect);
              //   } catch (error) {
              //     // if for some reason the route causes a problem then just go to the root
              //     // TODO: Find out why this sometimes gets segments
              //     this.router.navigateByUrl('/');
              //   }
              // } else {
              //   this.router.navigateByUrl('/');
              // }
              
            } else {
              console.error("User is not defined :(");              
            }
          } else {
            this.loginSubmitting = false;
            this.submissionError = result.error.message;
          }          
        }
      );
    }else{
      console.error("Login form invalid!");
    }
  }

  ngOnInit() {
  }

}

