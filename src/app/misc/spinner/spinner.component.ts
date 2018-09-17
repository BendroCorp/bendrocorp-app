import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SpinnerService } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit {

  shouldspin:boolean
  subscription:Subscription

  constructor(private spinnerService:SpinnerService) { 
    this.subscription = this.spinnerService.dataRefreshAnnounced$.subscribe(
      () => {
        this.shouldspin = this.spinnerService.isSpinning()
      }
    )
  }

  ngOnInit() {
    this.shouldspin = this.spinnerService.isSpinning()
  }

}
