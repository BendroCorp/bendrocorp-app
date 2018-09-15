import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(private authService:AuthService) { }
  isExecutive:boolean = this.authService.hasClaim(3)
  isDirector:boolean = this.authService.hasClaim(3)

  ngOnInit() {
  }

}
