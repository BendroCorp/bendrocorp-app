import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiOfflineService } from './api-offline.service';

@Component({
  selector: 'app-api-offline',
  templateUrl: './api-offline.component.html',
  styleUrls: ['./api-offline.component.css']
})
export class ApiOfflineComponent implements OnInit {

  subscription:Subscription
  appOffline:boolean = false

  constructor(private apiOfflineService:ApiOfflineService) { 
    this.apiOfflineService.dataRefreshAnnounced$.subscribe(
      () => {
        let result = this.apiOfflineService.appOnline()
        this.appOffline = result        
      }
    )    
  }

  ngOnInit() {
    this.apiOfflineService.requestCheck()
  }

  ngOnDestroy() {
    // Prevents memory leaks
    this.subscription.unsubscribe()
  }

}
