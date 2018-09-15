import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../event.service';
import { Event, EventAttendence } from '../../models/event-models';
import { MessageService } from '../../message/message.service';
import { AuthService } from '../../auth.service';
import { UserSessionResponse } from '../../models/user-models';
import { HttpErrorResponse } from '../../../../node_modules/@angular/common/http';

@Component({
  selector: 'event-attendence',
  templateUrl: './event-attendence.component.html',
  styleUrls: ['./event-attendence.component.css']
})
export class EventAttendenceComponent implements OnInit {
  @Input() event:Event
  @Input() hideAttendenceString:boolean = false;

  currentUser:UserSessionResponse = this.authService.retrieveUserSession() as UserSessionResponse
  attendenceString:string;

  constructor(private eventService:EventService, private authService:AuthService, private messageService:MessageService) { }

  setAttendence(typeId:number)
  {
    if (this.event) {
      if (typeId === 1 || typeId === 2) {
        this.eventService.setAttendence(this.event.id, typeId).subscribe(
          (result) => 
          {
            if (!(result instanceof HttpErrorResponse)) {
              if (this.event.attendences.find(x => x.id == result.id)) {
                this.event.attendences[this.event.attendences.findIndex(x => x.id == result.id)] = result
              } else {
                this.event.attendences.push(result)
              }
              this.setAttendenceString()
            }
          }
        )
      }else{
        console.error(`Provided attendence type ${typeId} out of accepted range!`)
        this.messageService.addError("Something went wrong. Please try again later!")
      }
    }
  }

  checkCurrentStatus()
  {
    return this.event.attendences.find(x => x.user_id == this.currentUser.id)
  }

  setAttendenceString()
  {
    // let attendArray = []
    // let source = from(OrderBy.order(this.event.attendences, 'character.full_name')).pipe(map(({ full_name }) => full_name))
    // let results = source.subscribe(val => attendArray.push(val))

    // this.attendenceString = attendArray.join(', ')
    this.attendenceString = this.event.attendences.filter(x => x.attendence_type_id == 1).map(val => val.character.full_name).join(', ')
    console.log(this.attendenceString)
    // let attendArray = []
    // let attendences = OrderBy.order(this.event.attendences, 'character.fullname').map(val => `${val},`)
    // for(let index = 0; index < attendences.length; index++) {
    //   const attendence = attendences[index];
      
    // }
  }

  ngOnInit() 
  {
    if (!this.event) {
      console.error("Event not passed properly to attendence component!");
    }else{
      this.setAttendenceString()
    }
  }
}
