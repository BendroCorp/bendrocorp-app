import { Component, OnInit } from '@angular/core';
import { SignUp } from '../models/user-models';
import { AuthService } from '../auth.service';
import { MessageService } from '../message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  constructor(private authService:AuthService, private messageService:MessageService, private router:Router) { }
  newSignUp:SignUp = { } as SignUp
  signUpSubmitting:boolean = false

  createSignUp()
  {
    if (this.newSignUp.username) {
      if (this.newSignUp.email) {
        if (this.newSignUp.password && this.newSignUp.password_confirmation && this.newSignUp.password === this.newSignUp.password_confirmation) {
          this.signUpSubmitting = true
          this.authService.signup(this.newSignUp).subscribe(
            (result) => {
              this.signUpSubmitting = false
              if (!(result instanceof HttpErrorResponse)) {                
                this.router.navigateByUrl('/login')
              }
            }
          )
        } else {
          this.messageService.addError('Sign Up: Password and confirmation password do not match')
        }
      } else {
        this.messageService.addError('Sign Up: Email field empty')
      }
    } else {
      this.messageService.addError('Sign Up: Username field empty')
    }
  }

  ngOnInit() {
  }

}
