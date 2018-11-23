import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from '../message/message.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  formEmail:string
  submissionError:string
  submissionMessage:string
  requestResetSubmitting:boolean = false
  requestCompleted:boolean = false
  constructor(private authService:AuthService, private messageService:MessageService) { }

  requestReset()
  {
    if (this.formEmail) {
      this.requestResetSubmitting = true
      this.authService.requestPasswordReset(this.formEmail).subscribe(
        (results) => {
          this.submissionError = null
          this.submissionMessage = null
          this.requestResetSubmitting = false
          if (!(results instanceof HttpErrorResponse)) {
            this.requestCompleted = true
            this.messageService.addSuccess(results.message)
            this.submissionMessage = results.message
          }else{
            this.submissionError = results.error.message
          }
        }
      )
    }
  }

  ngOnInit() {
  }

}
