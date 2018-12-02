import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject, Observable } from 'rxjs';
import { DonationItem, Donation, StatusMessage } from '../models/misc-models';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DonationService {

  constructor(private http:HttpClient, private errorService:ErrorService, private globals:Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Requests service data refresh called!");    
    this.dataRefreshSource.next();
  }

  list() : Observable<DonationItem[]>
  {
    return this.http.get<DonationItem[]>(`${this.globals.baseUrl}/donation`).pipe(
      tap(result => console.log(`Fetched ${result.length} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Items', []))
    )
  }

  list_mine() : Observable<Donation[]>
  {
    return this.http.get<Donation[]>(`${this.globals.baseUrl}/donation/mine`).pipe(
      tap(result => console.log(`Fetched ${result.length} donation!`)),
      catchError(this.errorService.handleError('Fetch Donations', []))
    )
  }

  fetch(donationId: number)
  {
    return this.http.get<DonationItem>(`${this.globals.baseUrl}/donation/${donationId}`).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    )
  }

  create(donation_item:DonationItem) : Observable<DonationItem>
  {
    return this.http.post<DonationItem>(`${this.globals.baseUrl}/donation/`, { donation_item }).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    )
  }

  update(donation_item:DonationItem) : Observable<DonationItem>
  {
    return this.http.put<DonationItem>(`${this.globals.baseUrl}/donation/`, { donation_item }).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    )
  }

  archive(donation_item:DonationItem) : Observable<DonationItem>
  {
    return this.http.delete<DonationItem>(`${this.globals.baseUrl}/donation/${donation_item.id}`).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    )
  }

  donate(donation:Donation) : Observable<Donation>
  {
    return this.http.post<Donation>(`${this.globals.baseUrl}/donation/make`, { donation }).pipe(
      tap(result => console.log(`Fetched ${result.id} donation items!`)),
      catchError(this.errorService.handleError('Fetch Donation Item'))
    )
  }
}
