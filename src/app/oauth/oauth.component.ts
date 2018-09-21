import { Component, OnInit } from '@angular/core';
import { OauthService } from './oauth.service';
import { ActivatedRoute } from '@angular/router';
import { SpinnerService } from '../misc/spinner/spinner.service';
import { MessageService } from '../message/message.service';
import { OAuthClient, OAuthRequest } from '../models/misc-models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class OauthComponent implements OnInit {
  clientChecked:boolean = false
  client:OAuthClient
  request:OAuthRequest
  constructor(private oAuthService:OauthService, private route:ActivatedRoute, private spinnerService:SpinnerService, private messageService:MessageService) { }

  authorizeClient()
  {
    if (this.request) {
      this.spinnerService.spin(true)
      this.oAuthService.fetch_oauth_token(this.request).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            window.location.href = results.message
          }else{
            this.spinnerService.spin(false)
          }
        }
      )
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.route.queryParams.subscribe(
      (params) => {
        // this is an example of what we should be getting:
        // http://localhost:4200/oauth?client_id=test-client&response_type=token&state=something&redirect_uri=https://something.com
        if (params['client_id'] && params['response_type'] && params['state'] && params['redirect_uri']) {
          this.request = { client_id: params['client_id'], response_type: params['response_type'], state: params['state'], redirect_uri: params['redirect_uri'] } as OAuthRequest
          if (this.request) {
            this.oAuthService.fetch_client(this.request).subscribe(
              (results) => {
                this.spinnerService.spin(false)
                this.clientChecked = true
                if (!(results instanceof HttpErrorResponse)) {
                  this.client = results                
                }
              }
            )
          } else {
            this.messageService.addError("Cannot check client. Request object is malformed or missing!")
          }
        } else {
          this.messageService.addError("Client request URL not properly formed cannot authorize application.")
        }
      }
    )
  }

}
