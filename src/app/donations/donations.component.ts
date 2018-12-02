import { Component, OnInit, OnDestroy } from '@angular/core';
import { DonationItem, Donation } from '../models/misc-models';
import { Subscription } from 'rxjs';
import { DonationService } from './donation.service';
import { MessageService } from '../message/message.service';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SpinnerService } from '../misc/spinner/spinner.service';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css']
})
export class DonationsComponent implements OnInit, OnDestroy {
  userDonations:Donation[] = []
  donationItems:DonationItem[] = []
  isAdmin:boolean = this.authService.hasClaim(2)
  subscription:Subscription
  
  constructor(private authService:AuthService, private donationService:DonationService, private messageService:MessageService, private spinnerService:SpinnerService) { 
    this.subscription = this.donationService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchDonationItems()
        this.fetchUserDonations()
      }
    )
  }

  fetchDonationItems()
  {
    this.donationService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.donationItems = results.sort((a,b) => {
            return a.ordinal - b.ordinal
          })
          this.spinnerService.spin(false)
        }
      }
    )
  }

  fetchUserDonations()
  {
    this.donationService.list_mine().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.userDonations = results.sort((a,b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          })
          this.spinnerService.spin(false)
        }
      }
    )
  }

  itemWidth(item:DonationItem)
  {
    return (item.total_donations * 100) / item.goal
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.fetchDonationItems()
    this.fetchUserDonations()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
