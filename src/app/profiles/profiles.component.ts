import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Division } from '../models/character-models';
import { DomSanitizer } from '../../../node_modules/@angular/platform-browser';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  divisions:Division[]
  dataLoaded:boolean = false
  constructor(private profileService:ProfileService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.profileService.list_by_division().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.dataLoaded = true
          this.divisions = results
        }
      }
    )
  }

}
