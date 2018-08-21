import { Component, OnInit, Input } from '@angular/core';
import { CharacterApplication, CharacterApplicationComment } from '../../models/character-models';
import { AuthService } from '../../auth.service';
import { MessageService } from '../../message/message.service';
import { ApplicationService } from '../application.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'application-details',
  templateUrl: './application-details.component.html',
  styleUrls: ['./application-details.component.css']
})
export class ApplicationDetailsComponent implements OnInit {
  hrRights:boolean = (this.authService.hasClaim(12) || this.authService.hasClaim(9)) ? true : false
  newCommentText:string;
  updateInProgress:boolean = false;

  constructor(private authService:AuthService, private applicationService:ApplicationService, private messageService:MessageService) { }
  @Input() application:CharacterApplication

  addApplicationComment()
  {
    if (this.newCommentText && this.newCommentText.length > 0) {
      let newComment = { application_id: this.application.id, comment: this.newCommentText } as CharacterApplicationComment
      this.applicationService.addApplicationComment(newComment).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.messageService.addSuccess("Comment added to employee application!")
            this.application.comments.push(results)
          }
        }
      )
    }else{
      this.messageService.addInfo("Application Comment: You must actually enter a comment to submit an application comment...")
    }
  }

  ngOnInit() {
  }

}
