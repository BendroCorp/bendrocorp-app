import { Component, OnInit, Input } from '@angular/core';
import { CharacterApplicationInterview, CharacterApplication } from '../../models/character-models';
import { ProfileService } from '../profile.service';
import { ApplicationService } from '../application.service';
import { MessageService } from '../../message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'application-interview',
  templateUrl: './application-interview.component.html',
  styleUrls: ['./application-interview.component.css']
})
export class ApplicationInterviewComponent implements OnInit {

  constructor(private profileService:ProfileService, private applicationService:ApplicationService, private messageService:MessageService) { }
  @Input() application:CharacterApplication
  lockFields:boolean
  updateInProgress:boolean = false

  updateInterview()
  {
    if (this.application && this.application.interview) {
      if (this.application.application_status_id < 6) {
        this.updateInProgress = true
        this.applicationService.updateInterview(this.application.interview).subscribe(
          (results) => {
            this.updateInProgress = false
            if (!(results instanceof HttpErrorResponse)) {
              this.lockFields = results.locked_for_review
            }
          }
        )
      } else {
        this.messageService.addError('This application has already been completed. The interview cannot be updated!')
      }
    }else{
      this.messageService.addError('Application or application interview not passed correctly to interview component!')
    }
  }
  
  ngOnInit() {
    if (!this.application) {
      console.error("Character application not properly passed")
    }else{
      this.lockFields = (this.application.interview.locked_for_review || this.application.application_status_id >= 6) ? true : false
      console.log(this.lockFields);
      
    }
  }

}
