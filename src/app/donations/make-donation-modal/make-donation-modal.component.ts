import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DonationService } from '../donation.service';
import { PaymentProviderService } from 'src/app/payment-provider.service';
import { DonationItem, Donation } from 'src/app/models/misc-models';
import { NgbModal, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from 'src/app/message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'ngbd-modal-content',
  template: `
  <style>
    .StripeElement {
      background-color: white;
      padding: 8px 12px;
      border-radius: 4px;
      border: 1px solid transparent;
      box-shadow: 0 1px 3px 0 #e6ebf1;
      -webkit-transition: box-shadow 150ms ease;
      transition: box-shadow 150ms ease;
      margin-bottom: 8px;
    }
    
    .StripeElement--focus {
      box-shadow: 0 1px 3px 0 #cfd7df;
    }
    
    .StripeElement--invalid {
      border-color: #fa755a;
    }
    
    .StripeElement--webkit-autofill {
      background-color: #fefde5 !important;
    }
  </style>
  <div class="modal-header">
    <h4 class="modal-title" id="modal-basic-title">Make Donation</h4>
    <button type="button" class="close" aria-label="Close" (click)="activeModal.close()">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
  <div class="modal-body">
    <form #makeDonationForm="ngForm" (ngSubmit)="onCardSubmit(checkout)" class="checkout">
      <div class="form-group">
        <label>Donation Item</label>
        <p>{{donationItem.title}}</p>
      </div>
      <div class="form-group">
        <label>Donation Amount</label>
        <input required [(ngModel)]="donationAmount" placeholder="Enter donation amount..." class="form-control" type="number" min="1" name="donationAmount">
        <small class="text-muted">* Only enter whole dollars.</small>
      </div>
      <div class="form-row">
        <label for="card-element">Card Info</label>
        <div style="width: 30em" id="card-element" #cardElement></div>
        <div style="width: 30em" id="card-errors" role="alert" *ngIf="error">{{ error }}</div>
      </div>              
      <div class="form-group">
        <button class="btn btn-primary" type="submit" [disabled]="donationInProgress || !makeDonationForm.form.valid">
          <span *ngIf="!donationInProgress">Send Donation</span>
          <span *ngIf="donationInProgress">Submitting... <i class="fas fa-spinner fa-spin"></i></span>
        </button>
      </div>
      <div>
        <small>* We do not store or retain your credit card information. Please consult our Privacy Policy for more details.<br />** By submitting this donation you understand that this amount is non-refundable. The amount you give will be used for the specified donation item titled above. By donating to the above you gain no rights to that item and its use and operations are determined by the direction of BendroCorp officers and by BendroCorp policy and procedure.</small>
      </div>
    </form>
  </div>
  `
})
export class DonationModalContent implements AfterViewInit {
  @Input() donationItem:DonationItem
  @ViewChild('cardElement') cardElement: ElementRef;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  donationInProgress:boolean = false;
  donationAmount:number
  openModal:NgbModalRef
  submissionError = "";

  constructor(public activeModal: NgbActiveModal, private modalService: NgbModal, private donationService:DonationService, private cd:ChangeDetectorRef, private pp:PaymentProviderService, private messageService:MessageService) {}

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onCardSubmit(form: NgForm) {
    if (this.donationAmount >= 1 && this.isInt(this.donationAmount)) {
      this.donationInProgress = true;
      const { source, error }  = await this.pp.stripe.createSource(this.card);
      
      // 4242 4242 4242 4242 - with any expiration date in the future, any 3-digit number for the CVC and any valid zip code.
      if (error) {
        console.error('Something is wrong with the Stripe validation:', error);
        this.messageService.addError(error.message)
        this.donationInProgress = false;
      } else {
        console.log('Success!', source);
        console.log("Source ID " + source.id);

        this.donationService.donate({ amount: this.donationAmount, donation_item_id: this.donationItem.id, card_token: source.id } as Donation).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.messageService.addSuccess("Donation Successful!")
              this.donationService.refreshData()
              this.activeModal.close()
            }else{
              this.donationInProgress = false
            }
          }
        )
      }
    } else {
     this.messageService.addError("Invalid donation entry. Donation must be greate than $1 and be a whole dollar. (ie. $1, $2, etc not $1.01") 
    }
  }

  private isInt(n) {
    return n % 1 === 0;
  }

  ngAfterViewInit()
  {
    this.card = this.pp.elements.create('card');
    this.card.mount(this.cardElement.nativeElement);
    this.card.addEventListener('change', this.cardHandler);
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }
  

  ngOnInit() {
  }
}

@Component({
  selector: 'make-donation-modal',
  templateUrl: './make-donation-modal.component.html',
  styleUrls: ['./make-donation-modal.component.css']
})

export class MakeDonationModalComponent implements OnInit {
  @Input() donationItem:DonationItem
  isComplete:boolean

  constructor(private modalService: NgbModal) { }

  open() {
    const modalRef = this.modalService.open(DonationModalContent);
    modalRef.componentInstance.donationItem = this.donationItem;
  }

  ngOnInit() {
    this.isComplete = this.donationItem.is_completed
  }

}
