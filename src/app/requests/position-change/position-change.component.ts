import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../profiles/profile.service';
import { MessageService } from '../../message/message.service';
import { RequestsService } from '../requests.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Character, Job } from '../../models/character-models';
import { PositionChangeRequest } from '../../models/request-models';

@Component({
  selector: 'app-position-change',
  templateUrl: './position-change.component.html',
  styleUrls: ['./position-change.component.css']
})
export class PositionChangeComponent implements OnInit {
  positionChangeRequest:PositionChangeRequest = { } as PositionChangeRequest
  characters:Character[] = []
  selectedCharacter:Character
  availableJobs:Job[] = []
  jobs:Job[] = []

  requestSubmitting:boolean = false

  constructor(private messageService:MessageService, private profileService:ProfileService, private requestService:RequestsService) { }

  submitPositionChangeRequest()
  {
    if (this.positionChangeRequest && (this.positionChangeRequest.character_id && this.positionChangeRequest.job_id)) {
      this.requestSubmitting = true
      this.requestService.positionChangeRequest(this.positionChangeRequest).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.requestSubmitting = false
            this.positionChangeRequest = { } as PositionChangeRequest
            this.messageService.addSuccess("Position change request successfully submitted!")
          }
        }
      )
    }
  }

  selectCharacter()
  {
    if (this.positionChangeRequest && this.positionChangeRequest.character_id) {
      this.selectedCharacter = this.characters.find(x => x.id == this.positionChangeRequest.character_id)
      this.availableJobs = this.jobs.filter(x => x.id != this.selectedCharacter.current_job.id)
    }
  }

  ngOnInit() {
    this.profileService.list_jobs().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log(results)
          this.jobs = results
        }
      }
    )

    this.profileService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log(results)
          this.characters = results
        }
      }
    )
  }

}
