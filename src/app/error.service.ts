import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { MessageService } from './message/message.service';
import { Message } from './models/message-models';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Globals } from './globals';
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class ErrorService {
  msg:Message = new Message; 
  constructor(private messageService: MessageService, private router:Router, private http:HttpClient, private globals:Globals) { }
  handleError<T> (operation = 'operation', result?: T, skipMessage?:boolean) {
    return (error: any): Observable<T> => {
  
      // TODO: send the error to remote logging infrastructure
      
      console.error(error); // log to console instead
      this.msg.type = 2 // error
      if (error instanceof HttpErrorResponse) {
        if (error.error && error.error.message) {
          this.msg.message = `${operation}: ${error.error.message}`
        } else {
          this.msg.message = `${operation}: ${error.message}`
        }

        // if we get a 401 that means that we need to be logged in
        // forward to the login page
        if (error.status == 401) {
          localStorage.removeItem('userObject')
          //localStorage.setItem("authRedirect", error.url)
          this.router.navigateByUrl('/'); //forces the page to actually reload
          // need to handle telling the menu that an auth error happened
          this.announceAuthError()
        }

      } else {
        this.msg.message = `${operation} failed: ${error.message}`
      }

      console.log(this.msg.message);

      // this.createLog({ severity: 'ERROR', module: operation, message: error.message } as LogItem) 
      if (!skipMessage) {
        this.messageService.add(this.msg);
      }
           
      return of(error as T);
    };
  }

  handleHttpError<T> (result?: T) {
    return (error: any): Observable<T> => {
      // right now all we are trying to address here is if this is a 401 error
      if (error.status == 401) {
        console.log("401 received - forwarding to login...")
        // this.authService.logout();
        // this.authService.setOnAuthRedirect(err.url);
        this.fourZeroOneError(error.url)        
      }
      return of(error as T);
    }
  }

  private authErrorSource = new Subject();
  authErrorAnnounced$ = this.authErrorSource.asObservable();
  announceAuthError()
  {
    console.log("Error service data refresh called!");    
    this.authErrorSource.next();
  }

  // private createLog(log:LogItem)
  // {
  //   return this.http.post(`${this.globals.baseUrl}/logs`, { log }).pipe(
  //     tap(results => console.log())
  //   )
  // }

  fourZeroOneError(uri:string)
  {
    localStorage.setItem("authRedirect", uri)
    let didLogout = localStorage.removeItem('userObject') ? of(true) : of(false);
    this.router.navigateByUrl('/login')
  }
}
