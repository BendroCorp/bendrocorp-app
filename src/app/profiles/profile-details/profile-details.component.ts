import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ProfileService } from '../profile.service';
import { Character, CharacterApplicationComment } from '../../models/character-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { AuthService } from '../../auth.service';
import { ApplicationService } from '../application.service';
import { MessageService } from '../../message/message.service';
import { UserSessionResponse } from '../../models/user-models';
import { Base64Upload } from '../../models/misc-models';
import { OwnedShip, Ship } from '../../models/ship-models';
import { SpinnerService } from '../../misc/spinner/spinner.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  profileId:number = this.parseProfileId()
  canEdit:boolean = false
  ceoRights:boolean = (this.authService.hasClaim(9)) ? true : false;
  hrRights:boolean = (this.authService.hasClaim(12) || this.authService.hasClaim(9)) ? true : false
  directorRights:boolean = this.authService.hasClaim(3)
  shipList:Ship[]
  newShip:OwnedShip = { } as OwnedShip

  profile:Character
  constructor(private route:ActivatedRoute, private router:Router, private profileService:ProfileService, private applicationService:ApplicationService, private messageService:MessageService, private authService:AuthService, private spinnerService:SpinnerService) { }

  fetchProfile()
  {
    this.profileService.fetch(this.profileId).subscribe(
      (result) => {
        this.spinnerService.spin(false)
        if (!(result instanceof HttpErrorResponse)) {
          this.profile = result
          this.canEdit = ((this.profile.user_id === (this.authService.retrieveUserSession() as UserSessionResponse).id) || this.hrRights) ? true : false
          if (this.canEdit && !this.shipList) {
            this.profileService.list_ships().subscribe(
              (results) => {
                if (!(results instanceof HttpErrorResponse)) {
                  this.shipList = results
                }
              }
            )
          }
        }else{
          this.router.navigateByUrl('/profiles')
        }
      }
    )
  }

  updateProfile()
  {
    if (this.profile) {
      if (this.canEdit) {
        this.profileService.update(this.profile).subscribe(
          (result) => {
            if (!(result instanceof HttpErrorResponse)) {
              this.profileService.refreshData()
            }
          }
        )
      } else {
        this.messageService.addError("You are not authorized to edit this character.")
      }
    }else{
      console.error("There is really no way you should get this message...since you should be forward away...but...updateProfile could not find a profile")
    }
  }

  updateAvatar()
  {
    if (this.profile) {
      if (this.canEdit) {
        this.profileService.updateAvatar(this.profile).subscribe(
          (result) => {
            if (!(result instanceof HttpErrorResponse)) {
              this.profileService.refreshData()
            }
          }
        )
      } else {
        this.messageService.addError("You are not authorized to edit this character.")
      }
    }else{
      console.error("There is really no way you should get this message...since you should be forward away...but...updateProfile could not find a profile")
    }
  }

  addOwnedShip()
  {
    if (this.newShip && this.canEdit) {
      this.newShip.character_id = this.profile.id
      this.profileService.addShip(this.newShip).subscribe(
        (results) => {
          this.newShip = { } as OwnedShip
          this.fetchProfile()
        }
      )
    }
  }

  archiveShip(ownedShip:OwnedShip)
  {
    if (ownedShip) {
      if (confirm("Are you sure you want to archived this ship? This action cannot be easily undone...")) {
        if (this.canEdit) {
          this.profileService.removeShip(ownedShip).subscribe(
            (results) => {
              if (!(results instanceof HttpErrorResponse)) {
                this.profile.owned_ships.splice(this.profile.owned_ships.findIndex(x => x.id == ownedShip.id),1)
              }
            }
          )
        }
      }
    }else{
      console.error("Owned ship not passed to archiveShip");
      
    }
  }

  advanceApplication()
  {
    if (this.hrRights && this.profile.application && this.profile.application.application_status_id < 6) {
      if (confirm("Are you sure you want to advance this application?")) {
        this.applicationService.advanceApplication(this.profile).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.fetchProfile()
            }
          }
        )
      }
    } else {
      this.messageService.addError("You are not authorized to advance applications!")
    }
  }

  rejectApplication(character:Character)
  {
    if (this.hrRights && character.application.application_status_id < 6) {
      if (confirm("Are you sure you want to reject this application?")) {
        this.applicationService.rejectApplication(character).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.fetchProfile()
            }
          }
        )
      }
    } else {
      this.messageService.addError("You are not authorized to reject applications!")
    }
  }

  addApplicationComment(applicationComment:CharacterApplicationComment)
  {
    this.applicationService.addApplicationComment(applicationComment).subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.profile.application.comments.push(results)
        }
      }
    )
  }

  handleAvatarFileInput(files: FileList)
  {
    console.log(files);
    // fetch file data on file to uploads    
    let file = files.item(0);    

    // add the avatar information to the user object so it can be uploaded
    this.getBase64(file).then(
      result => {
        this.profile.new_avatar = { name: file.name, type: file.type, size: file.size, base64: result } as Base64Upload;
      }
    );
  }

  getBase64(file) {
    // https://stackoverflow.com/questions/47936183/angular-5-file-upload
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  /**
   * Parses the profile name from the url - assumes "first_name-last_name-id"
   */
  private parseProfileId() : number
  {
    let threePart = this.route.snapshot.paramMap.get('character_id').split('-')
    // 0 = first name, 1 = last name, 2 = id
    // is the url properly formed?
    if (threePart && threePart.length == 3) {
      if (parseInt(threePart[2])) {
        return parseInt(threePart[2])
      } else {
        console.log("Profile link not formed correctly!");
        this.messageService.addError("Fetch Profiles: It looks like the profile link is not formed correctly...")
        this.router.navigateByUrl('/profiles')
      }
    } else {
      console.log("Profile link not formed correctly!");
      this.messageService.addError("Fetch Profiles: It looks like the profile link is not formed correctly...")
      this.router.navigateByUrl('/profiles')
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.fetchProfile()
  }

}
