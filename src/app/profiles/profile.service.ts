import { Injectable } from '@angular/core';
import { HttpClient } from '../../../node_modules/@angular/common/http';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Observable } from '../../../node_modules/rxjs';
import { Character, Division } from '../models/character-models';
import { tap, catchError } from '../../../node_modules/rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient, private errorService:ErrorService, private globals:Globals) { }

  list() : Observable<Character[]>
  {
    return this.http.get<Character[]>(`${this.globals.baseUrl}/profile`).pipe(
      tap(result => console.log(`Fetched ${result.length} profiles!`)),
      catchError(this.errorService.handleError('Fetch Profiles', []))
    )
  }

  list_by_division() : Observable<Division[]>
  {
    return this.http.get<Division[]>(`${this.globals.baseUrl}/profile/by-division`).pipe(
      tap(result => console.log(`Fetched ${result.length} profiles!`)),
      catchError(this.errorService.handleError('Fetch Profiles', []))
    )
  }

  fetch(profile_id:number) : Observable<Character>
  {
    return this.http.get<Character>(`${this.globals.baseUrl}/profile/${profile_id}`).pipe(
      tap(result => console.log(`Fetched profile id #${profile_id}!`)),
      catchError(this.errorService.handleError<any>('Fetch Profiles'))
    )
  }
}
