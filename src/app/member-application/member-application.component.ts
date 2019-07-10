import { Component, OnInit } from '@angular/core';
import { ApplicationService } from '../profiles/application.service';
import { ProfileService } from '../profiles/profile.service';
import { MessageService } from '../message/message.service';
import { NewCharacterApplication, Job, CharacterApplication } from '../models/character-models';
import { Ship, OwnedShip } from '../models/ship-models';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { UserSessionResponse, User } from '../models/user-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-member-application',
  templateUrl: './member-application.component.html',
  styleUrls: ['./member-application.component.css']
})
export class MemberApplicationComponent implements OnInit {
  dataLoaded:boolean = false
  applicationSubmitting:boolean = false
  policyCheck:boolean = false
  characterApplication:NewCharacterApplication
  currentApplication:CharacterApplication
  isApplicant:boolean = ((this.authService.retrieveUserSession() as UserSessionResponse).first_name && !this.authService.hasClaim(0)) ? true : false
  ships:Ship[]
  jobs:Job[]

  constructor(private authService:AuthService, private applicationService:ApplicationService, private profileService:ProfileService, private messageService:MessageService) { }

  fetchApplication()
  {
    this.applicationService.fetchApplication().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse) && results.id) {
          this.currentApplication = results
        }
        this.dataLoaded = true
      }
    )
  }

  submitApplication()
  {
    this.applicationSubmitting = true
    // NOTE: This is silly and may do nothing...
    // SADLY it does everything...
    this.characterApplication.owned_ship.ship_id = parseInt(this.characterApplication.owned_ship.ship_id.toString())
    this.characterApplication.owned_ships_attributes.push(this.characterApplication.owned_ship)
    this.characterApplication.application_attributes.job_id = parseInt(this.characterApplication.application_attributes.job_id.toString())
    this.applicationService.createApplication(this.characterApplication).subscribe(
      (results) => {
        this.applicationSubmitting = false
        if (!(results instanceof HttpErrorResponse)) {
          this.currentApplication = results
        }
      }
    )
  }

  ngOnInit() {
    // fetch
    this.fetchApplication()

    // stub the objects
    this.characterApplication = { } as NewCharacterApplication
    this.characterApplication.owned_ship = { } as OwnedShip
    this.characterApplication.owned_ships_attributes = [] as OwnedShip[]
    this.characterApplication.application_attributes = { } as CharacterApplication
    this.characterApplication.user_attributes = { } as User

    // Get all the ships
    this.profileService.list_ships().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.ships = results
        }
      }
    )

    // get all the jobs
    this.profileService.list_hiring_jobs().subscribe(
      (results) =>
      {
        if (!(results instanceof HttpErrorResponse)) {
          this.jobs = results
        }
      }
    )
  }

}
