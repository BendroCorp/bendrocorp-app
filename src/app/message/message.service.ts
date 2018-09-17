import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Message } from '../models/message-models';
import { SwUpdate } from '@angular/service-worker';

@Injectable()
export class MessageService {
  messages: Message[] = []; 

  constructor (private update: SwUpdate) { } // NOTE - this may cause trouble

  // Observable string streams
  private messageSource = new Subject();
  messageAnnounced$ = this.messageSource.asObservable();
  refreshData()
  { 
    this.messageSource.next();
  }

  addSuccess(message: string)
  {
    let msg:Message = { message: message, type: 1 }
    this.add(msg)
  }

  addError(message: string)
  {
    let msg:Message = { message: message, type: 2 }
    console.error(message)
    this.add(msg)
  }

  addInfo(message: string)
  {
    let msg:Message = { message: message, type: 3 }
    console.log(message)
    this.add(msg)
  }

  addUpdateMessage(message: string)
  {
    let msg:Message = { message: message, type: 4 }
    this.add(msg)
  }

  doUpdate()
  {
    this.update.activateUpdate().then(() => document.location.reload())
  }

  add(message: Message) {
    this.messages.push(message);
    this.refreshData();
  }

  clear() {
    this.messages = [];
  }
}