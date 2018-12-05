import { Injectable } from '@angular/core';
import { UserSessionResponse, SignUp, NewPassword, TwoFactorDataObject, TwoFactorAuthObject, TokenObject } from './models/user-models';
import { HttpClient } from '@angular/common/http'; // https://stackoverflow.com/questions/47369850/property-get-does-not-exist-on-type-httpclientmodule
import * as moment from 'moment';
import { tap, catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';
import { Globals } from './globals';
// import 'rxjs/add/observable/of'; // https://stackoverflow.com/questions/36568388/observable-of-is-not-a-function
import { MessageService } from './message/message.service';
import { Subject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { StatusMessage } from './models/misc-models';

@Injectable()
export class AuthService {
  // https://www.metaltoad.com/blog/angular-5-making-api-calls-httpclient-service
  // https://blog.angular-university.io/angular-jwt-authentication/
  constructor(public http: HttpClient,
    public messageService: MessageService,
    public err: ErrorService,
    public globals: Globals,
    public router: Router) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  refreshData() {
    console.log('Auth service data refresh called!');
    this.dataRefreshSource.next();
  }

  /** Log the user in. */
  login(email: string, password: string, code?: string) {
    const device = 'Web'
    return this.http.post<UserSessionResponse>(`${this.globals.baseUrlRoot}/auth`, { 'session': { email, password, code, device } }).pipe(
      tap(result => {
        this.messageService.addSuccess('Login Successful! Welcome back!')
      }),
      catchError(this.err.handleError('Login', []))
    );
  }

  signup(signup: SignUp) {
    return this.http.post<StatusMessage>(`${this.globals.baseUrl}/signup`, { signup }).pipe(
      tap(result => console.log('New sign up created!')),
      catchError(this.err.handleError<any>('Sign Up'))
    )
  }

  changePassword(password: NewPassword) {
    return this.http.post<StatusMessage>(`${this.globals.baseUrl}/account/change-password`, { password }).pipe(
      tap(result => console.log('Password updated!')),
      catchError(this.err.handleError<any>('Update Password'))
    )
  }

  fetchTfa(): Observable <TwoFactorDataObject> {
    return this.http.get<TwoFactorDataObject>(`${this.globals.baseUrl}/account/fetch-tfa`).pipe(
      tap(result => console.log('Fetch TFA!')),
      catchError(this.err.handleError<any>('Fetch TFA'))
    )
  }

  enableTfa(two_factor_auth: TwoFactorAuthObject): Observable <StatusMessage> {
    return this.http.post<StatusMessage>(`${this.globals.baseUrl}/account/enable-tfa`, { two_factor_auth }).pipe(
      tap(result => console.log('Enable TFA!')),
      catchError(this.err.handleError<any>('Enable TFA'))
    )
  }

  fetchAuthTokens(): Observable<TokenObject[]> {
    return this.http.get<TokenObject[]>(`${this.globals.baseUrl}/user/auth-tokens`).pipe(
      tap(result => console.log(`Fetched ${result.length} tokens`)),
      catchError(this.err.handleError<any>('Retrieve Auth Tokens'))
    )
  }

  removeAuthToken(token: string): Observable<StatusMessage> {
    return this.http.delete<StatusMessage>(`${this.globals.baseUrl}/account/token/${token}`).pipe(
      tap(result => console.log('Removed auth token!')),
      catchError(this.err.handleError<any>('Remove Auth Token'))
    )
  }

  requestPasswordReset(email: string): Observable<StatusMessage> {
    const user = { email: email }
    return this.http.post<StatusMessage>(`${this.globals.baseUrl}/account/forgot-password`, { user }).pipe(
      tap(result => console.log('Requested password reset!')),
      catchError(this.err.handleError<any>('Request Password Reset'))
    )
  }

  doPasswordReset(password: string, password_confirmation: string, password_reset_token: string): Observable<StatusMessage> {
    const user = { password, password_confirmation, password_reset_token }
    return this.http.post<StatusMessage>(`${this.globals.baseUrl}/account/reset-password`, { user }).pipe(
      tap(result => console.log('Do password reset!')),
      catchError(this.err.handleError<any>('Password Reset'))
    )
  }

  // Internal stuff below here

  public hasClaim(roleId: number): boolean {
    if (this.isLoggedIn()) {
      if ((this.retrieveUserSession() as UserSessionResponse).claims.length > 0) {
        const claim = (this.retrieveUserSession() as UserSessionResponse).claims.find(x => x.id === roleId)
        if (claim) {
          return true
        }
      }
      return false
    } else {
      return false
    }
  }

  setSession(authResult): Observable<boolean> {
    if (authResult !== 'undefined') {
      localStorage.setItem('userObject', JSON.stringify(authResult));
      return of(true)
    } else {
      console.error('Undefined authResult passed to setSession!');
      return of(false)
    }
  }

  logout(): Observable<boolean> {
    // let didLogout = localStorage.removeItem('userObject') ? of(true) : of(false);
    // return didLogout
    localStorage.removeItem('userObject')
    return of(true)
  }

  public isLoggedIn() {
    if (this.retrieveUserSession()) {
      const notExpired = moment().isBefore(this.getExpiration());
      return notExpired;
    } else {
      // this.logout();
      return false;
    }
  }

  // tslint:disable-next-line:member-ordering
  public static retrieveUser() {
    if (localStorage.getItem('userObject') !== null && localStorage.getItem('userObject') !== 'undefined') {
      const retrieved = localStorage.getItem('userObject')
      const user = JSON.parse(retrieved)
      // console.log(user);
      return user;
    }
  }

  setOnAuthRedirect(uri: string) {
    localStorage.setItem('authRedirect', uri)
  }

  unSetOnAuthRedirect() {
    localStorage.removeItem('authRedirect')
  }

  getOnAuthRedirect(): string {
    return localStorage.getItem('authRedirect')
  }

  retrieveUserSession(): UserSessionResponse {
    if (localStorage.getItem('userObject') !== null && localStorage.getItem('userObject') !== 'undefined') {
      const retrieved = localStorage.getItem('userObject')
      const user = JSON.parse(retrieved)
      // console.log(user);
      return user;
    }
  }

  isLoggedOut() {
      return !this.isLoggedIn();
  }

  getExpiration() {
      const userObject = this.retrieveUserSession();
      return moment(userObject.token_expires);
  }

}
