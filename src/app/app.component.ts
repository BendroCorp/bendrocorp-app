import { Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { CheckForUpdateService } from './updates/check-for-update.service';
import { LogUpdateService } from './updates/log-update-service.service';
import { PromptUpdateService } from './updates/prompt-update-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(private checkForUpdate:CheckForUpdateService, private logUpdate:LogUpdateService, private promptUpdateService:PromptUpdateService) { }

  ngOnInit() {
    
  }
}
