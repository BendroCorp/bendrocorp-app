import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '../../../../node_modules/@angular/router';
import { ProfileService } from '../profile.service';
import { Character } from '../../models/character-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';
import { AuthService } from '../../auth.service';
import { ApplicationService } from '../application.service';
import { MessageService } from '../../message/message.service';

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.css']
})
export class ProfileDetailsComponent implements OnInit {
  profileId:number = this.parseProfileId()
  hasHrDirectorRights:boolean = this.authService.hasClaim(12)
  hasCEORights:boolean = this.authService.hasClaim(9)

  profile:Character
  constructor(private route:ActivatedRoute, private router:Router, private profileService:ProfileService, private applicationService:ApplicationService, private messageService:MessageService, private authService:AuthService) { }

  fetchProfile()
  {
    this.profileService.fetch(this.profileId).subscribe(
      (result) => {
        if (!(result instanceof HttpErrorResponse)) {
          this.profile = result
        }else{
          this.router.navigateByUrl('/profiles')
        }
      }
    )
  }

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
    this.fetchProfile()
  }

}
