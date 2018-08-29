import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { NewPassword, TwoFactorDataObject, TwoFactorAuthObject, UserSessionResponse } from '../models/user-models';
import { MessageService } from '../message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.css']
})
export class SettingsModalComponent implements OnInit {
  openModal:NgbModalRef
  passwordChange:NewPassword
  tfaDataObject:TwoFactorDataObject
  tfaAuthObject:TwoFactorAuthObject
  user = this.authService.retrieveUserSession() as UserSessionResponse

  constructor(private modalService: NgbModal, private authService:AuthService, private messageService:MessageService) {}

  doChangePassword()
  {
    if (this.passwordChange.original_password && this.passwordChange.password && this.passwordChange.password_confirmation && this.passwordChange.password === this.passwordChange.password_confirmation) {
      this.authService.changePassword(this.passwordChange).subscribe(
        (result) => {
          if (!(result instanceof HttpErrorResponse)) {
            this.passwordChange = { } as NewPassword
            this.messageService.addSuccess("Password successfully changed!")
          }
        }
      )
    }else{
      this.messageService.addError("Password form not filled out correctly!")
    }
  }

  doRequestTfa()
  {
    this.authService.fetchTfa().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.tfaDataObject = results
          this.tfaAuthObject = { } as TwoFactorAuthObject
        }
      }
    )
  }

  doEnableTfa()
  {
    this.authService.enableTfa(this.tfaAuthObject).subscribe(
      (result) => {
        if (!(result instanceof HttpErrorResponse)) {          
          this.user.tfa_enabled = true
          this.authService.setSession(this.user)
          this.authService.refreshData()
        }
      }
    )
  }

  doCancelMembership()
  {
    this.messageService.addInfo("The one click button is currently not available. If you would like to end your membership please contact your Director via Discord.")
  }

  open(content) {
    this.passwordChange = { } as NewPassword
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  close()
  {
    this.openModal.close()
  }

  ngOnInit() {
  }

}
