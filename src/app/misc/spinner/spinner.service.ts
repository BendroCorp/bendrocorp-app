import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  private doSpin:boolean = false 
  private dataRefreshSource = new Subject();

  constructor() { }
  /**
   * An observable which can be subcribed to which allows you to detect when a data refresh is announced.
   */
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();

  /**
   * This will cause a data refresh to be announced to all subscribers.
   */
  refreshData()
  {
    console.log("Spinner refresh called!");    
    this.dataRefreshSource.next();
  }

  /**
   * Start the spinner
   * @param shouldSpin Boolean indicating whether or not it should spin.
   */
  spin(shouldSpin:boolean)
  {
    this.doSpin = shouldSpin
    this.refreshData()
  }

  /**
   * Is the spinner spinning? :)
   */
  isSpinning()
  {
    return this.doSpin
  }  
}
