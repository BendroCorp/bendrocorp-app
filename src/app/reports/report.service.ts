import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from '../message/message.service';
import { ErrorService } from '../error.service';
import { Globals } from '../globals';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient, private messageService: MessageService, private errorService: ErrorService, private globals: Globals) { }

  private dataRefreshSource = new Subject();
  dataRefreshAnnounced$ = this.dataRefreshSource.asObservable();
  /**
   * Call this to signal all subscribers to refresh their data
   */
  refreshData()
  {
    console.log("Reports service data refresh called!");    
    this.dataRefreshSource.next();
  }
}
