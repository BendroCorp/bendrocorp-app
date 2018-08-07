import { Component, OnInit } from '@angular/core';
import { MessageService } from './message.service';
import { Subscription, Subject } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Message } from '../models/message-models';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(-100%)'}),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})
export class MessageComponent implements OnInit {
  capturedMessage:Message
  constructor(private messageService:MessageService){
    this.subscription = messageService.messageAnnounced$.subscribe(
      called => {
        this.capturedMessage = this.messageService.messages[0]
        if (this.capturedMessage.type === 1) {
          this.changeSuccessMessage(this.capturedMessage.message)
        } 
        else if(this.capturedMessage.type === 2) {
          this.changeErrorMessage(this.capturedMessage.message)
        } 
        else if(this.capturedMessage.type === 3)
        {
          this.changeInfoMessage(this.capturedMessage.message)
        }else if(this.capturedMessage.type === 4)
        {
          this.changeUpdateMessage(this.capturedMessage.message)
        }
        this.messageService.clear();
      }
    )
  }

  private subscription:Subscription; // for the message service
  private _successMessage = new Subject<string>();
  private _errorMessage = new Subject<string>();
  private _infoMessage = new Subject<string>();
  private _updateMessage = new Subject<string>();
  successMessage: string;
  infoMessage: string;
  errorMessage: string;
  updateMessage: string;

  ngOnInit(): void { //infoMessage

    // success message
    this._successMessage.subscribe((message) => this.successMessage = message);
    // debounceTime.call(this._successMessage, 7000).subscribe(() => this.successMessage = null);

    // Error message
    this._errorMessage.subscribe((message) => this.errorMessage = message);
    // debounceTime.call(this._errorMessage, 7000).subscribe(() => this.errorMessage = null);

    // Info message
    this._infoMessage.subscribe((message) => this.infoMessage = message);
    // debounceTime.call(this._infoMessage, 7000).subscribe(() => this.infoMessage = null);
  }

  changeSuccessMessage(message:string) {
    this._successMessage.next(message);
  }

  changeErrorMessage(message:string) {
    this._errorMessage.next(message);
  }

  changeInfoMessage(message:string) {
    this._infoMessage.next(message);
  }

  changeUpdateMessage(message:string) {
    this._updateMessage.next(message);
  }

}
