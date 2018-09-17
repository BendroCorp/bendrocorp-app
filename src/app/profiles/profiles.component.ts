import { Component, OnInit } from '@angular/core';
import { ProfileService } from './profile.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { Division } from '../models/character-models';
import { DomSanitizer } from '../../../node_modules/@angular/platform-browser';
import { SpinnerService } from '../misc/spinner/spinner.service';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  divisions:Division[]
  dataLoaded:boolean = false
  constructor(private profileService:ProfileService, private sanitizer: DomSanitizer, private spinnerService:SpinnerService) { }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.profileService.list_by_division().subscribe(
      (results) => {
        this.spinnerService.spin(false)
        if (!(results instanceof HttpErrorResponse)) {
          this.dataLoaded = true
          this.divisions = results
        }
      }
    )
  }

}
