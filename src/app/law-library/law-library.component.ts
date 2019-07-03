import { Component, OnInit, OnDestroy } from '@angular/core';
import { LawService } from './law.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Jurisdiction } from '../models/law.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-law-library',
  templateUrl: './law-library.component.html',
  styleUrls: ['./law-library.component.css']
})
export class LawLibraryComponent implements OnInit, OnDestroy {
  lawJurisdictions: Jurisdiction[];
  lawSubscription: Subscription;

  constructor(private lawService: LawService, private authService: AuthService, private router: Router, private messageService: MessageService) { }

  openJurisdiction(jurisdiction: Jurisdiction) {
    if (jurisdiction.id) {
      this.router.navigateByUrl(`/law-library/${jurisdiction.id}`);
    }
  }

  fetchJurisdictions() {
    this.lawService.listJurisdictions().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.lawJurisdictions = results;
      }
    });
  }

  ngOnInit() {
    if (!this.authService.hasClaim(43)) {
      this.messageService.addError('You are not authorized to directly access the law library!');
      this.router.navigateByUrl('/');
    } else {
      this.fetchJurisdictions();
    }
  }

  ngOnDestroy() {
    if (this.lawSubscription) {
      this.lawSubscription.unsubscribe();
    }
  }

}
