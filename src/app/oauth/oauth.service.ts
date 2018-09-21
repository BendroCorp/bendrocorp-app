import { Injectable } from '@angular/core';
import { OAuthClient, StatusMessage, OAuthRequest, OAuthToken } from '../models/misc-models';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { ErrorService } from '../error.service';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private http:HttpClient, private globals:Globals, private error:ErrorService) { }

  fetch_client(request:OAuthRequest) : Observable<OAuthClient>
  {
    return this.http.post<OAuthClient>(`${this.globals.baseUrl}/oauth-client-check`, { request }).pipe(
      tap(result => console.log("OAuth client check performed")),
      catchError(this.error.handleError<any>('OAuth Client Check', null))
    )
  }

  fetch_oauth_token(request:OAuthRequest) : Observable<StatusMessage>
  {
    return this.http.post<StatusMessage>(`${this.globals.baseUrl}/oauth-token`, { request }).pipe(
      tap(result => console.log("OAuth token requested")),
      catchError(this.error.handleError<any>('Fetch New OAuth Token', null))
    )
  }

  fetch_tokens() : Observable<OAuthToken[]>
  {
    return this.http.get<OAuthToken[]>(`${this.globals.baseUrl}/user/oauth-tokens`).pipe(
      tap(result => console.log("OAuth token list requested")),
      catchError(this.error.handleError('Fetch OAuth Tokens', []))
    )
  }

  remove_token(token:string) : Observable<StatusMessage>
  {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/oauth-token/${token}`).pipe(
      tap(result => console.log("OAuth token list requested")),
      catchError(this.error.handleError<any>('Delete OAuth Token'))
    )
  }
}
