import { Component, OnInit, OnDestroy } from '@angular/core';
import { FactionAffiliation } from '../models/misc-models';
import { Subscription } from 'rxjs';
import { FactionService } from '../misc/faction.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmationModal } from '../modals/confirmation-modal/confirmation-modal.component';
import { MessageService } from '../message/message.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SpinnerService } from '../misc/spinner/spinner.service';

@Component({
  selector: 'app-faction-admin',
  templateUrl: './faction-admin.component.html',
  styleUrls: ['./faction-admin.component.css']
})
export class FactionAdminComponent implements OnInit, OnDestroy {
  isAdmin: boolean = this.authService.hasClaim(51);
  factions: FactionAffiliation[] = [];
  factionSubscription: Subscription;
  initialDataLoaded: boolean = false;

  constructor(
    private factionService: FactionService,
    private confirmation: ConfirmationModal,
    private messageService: MessageService,
    private authService: AuthService,
    private router: Router,
    private spinner: SpinnerService
  ) { 
    this.factionSubscription = this.factionService.dataRefreshAnnounced$.subscribe(() => {
      this.fetchFactions();
    });
  }

  fetchFactions() {
    this.factionService.listFactions().subscribe((results) => {
      if (!(results instanceof HttpErrorResponse)) {
        this.factions = results;
        this.spinner.spin(false);
        this.initialDataLoaded = true;
      }
    });
  }

  splitId(splittableId: string) {
    return splittableId.split('-')[0];
  }

  async archiveFaction(faction: FactionAffiliation) {
    if (faction && faction.id) {
      if (await this.confirmation.open('Are you sure you want to archive this faction?')) {
        this.factionService.archiveFaction(faction).subscribe((results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.factions.slice(this.factions.findIndex(x => x.id === faction.id), 1);
            this.messageService.addSuccess('Faction archived!');
          }
        });
      }
    } else {
      this.messageService.addError('Faction not passed to archiveFaction');
    }
  }

  ngOnInit() {
    if (this.isAdmin) {
      this.spinner.spin(true);
      this.fetchFactions();
    } else {
      this.messageService.addError('You are not authorized to administer factions!')
      this.router.navigateByUrl('/');
    }
  }

  ngOnDestroy() {
    if (this.factionSubscription) {
      this.factionSubscription.unsubscribe();
    }
  }

}
