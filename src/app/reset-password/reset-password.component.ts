import { Component, OnInit } from '@angular/core';
import { MessageService } from '../message/message.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  formPassword:string
  formPasswordConfirmation:string
  submissionError:string
  submissionMessage:string
  requestResetSubmitting:boolean = false
  token:string = this.route.snapshot.paramMap.get('token')

  constructor(private route:ActivatedRoute, private router:Router, private authService:AuthService, private messageService:MessageService) { }

  requestReset()
  {
    if (this.formPassword && this.formPasswordConfirmation) {
      if (this.formPassword === this.formPasswordConfirmation) {
        this.requestResetSubmitting = true
        this.submissionMessage = null
        this.submissionError = null
        this.authService.doPasswordReset(this.formPassword, this.formPasswordConfirmation, this.token).subscribe(
          (results) => {
            this.requestResetSubmitting = false
            if (!(results instanceof HttpErrorResponse)) {
              this.messageService.addSuccess('Request completed! Please login with the password you just entered!')
              this.router.navigateByUrl('/login')
            } else {
              this.submissionError = results.error.message
              this.messageService.addError(results.error.message)
            }
          }
        )
      } else {
        this.messageService.addError("Password and confirmation password do not match!")
      }
    }else{
      this.messageService.addError("Form fields missing!")
    }
  }

  ngOnInit() {
    
  }

}
