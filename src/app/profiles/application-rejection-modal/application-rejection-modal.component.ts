import { Component, OnInit, Input } from '@angular/core';
import { Character } from 'src/app/models/character-models';
import { HttpErrorResponse } from '@angular/common/http';
import { ProfileService } from '../profile.service';
import { ApplicationService } from '../application.service';
import { MessageService } from 'src/app/message/message.service';
import { AuthService } from 'src/app/auth.service';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'application-rejection-modal',
  templateUrl: './application-rejection-modal.component.html',
  styleUrls: ['./application-rejection-modal.component.css']
})
export class ApplicationRejectionModalComponent implements OnInit {
  @Input() character:Character
  ceoRights:boolean = (this.authService.hasClaim(9)) ? true : false;
  hrRights:boolean = (this.authService.hasClaim(12) || this.authService.hasClaim(9)) ? true : false
  openModal:NgbModalRef
  constructor(private modalService: NgbModal, private profileService:ProfileService, private applicationService:ApplicationService, private messageService:MessageService, private authService:AuthService) { }

  rejectApplication()
  {
    const character = this.character
    if (this.hrRights && character.application.application_status_id < 6) {
      if (confirm("Are you sure you want to reject this application?")) {
        this.applicationService.rejectApplication(character).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.profileService.refreshData()
              this.openModal.close()
            }
          }
        )
      }
    } else {
      this.messageService.addError("You are not authorized to reject applications!")
    }
  }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'Rejection Modal'})
  }

  ngOnInit() {
    console.log("Passed character")
    console.log(this.character)
  }

}
