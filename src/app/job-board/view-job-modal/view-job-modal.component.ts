import { Component, OnInit, Input } from '@angular/core';
import { JobBoardMission } from '../../models/job-board-models';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth.service';
import { UserSessionResponse } from '../../models/user-models';
import { JobBoardService } from '../job-board.service';
import { MessageService } from '../../message/message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'view-job-modal',
  templateUrl: './view-job-modal.component.html',
  styleUrls: ['./view-job-modal.component.css']
})
export class ViewJobModalComponent implements OnInit {
  @Input() mission:JobBoardMission
  @Input() asButton:boolean = true
  openModal:NgbModalRef
  isAdmin:boolean = this.authService.hasClaim(28)

  constructor(private modalService:NgbModal, private authService:AuthService, private jobBoardService:JobBoardService, private messageService:MessageService) { }

  open(content) {
    this.openModal = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'})
  }

  acceptorString(mission:JobBoardMission, fullList:boolean = false) : string
  {
    if (fullList) {
      if (mission.on_mission && mission.on_mission.length > 0) {
        let names = mission.on_mission.map((char) => {
            return `${char.first_name} ${char.last_name}`
        })
        return names.join(', ')
      } else {
        return "None"
      }
    } else {
      if (mission.on_mission && mission.on_mission.length > 0) {
        if (mission.on_mission.length > 1) {
          return "Multiple"
        } else {
          return mission.on_mission.map((char) => {
            return `${char.first_name} ${char.last_name}`
          })[0]
        }
      } else {
        return "None"
      }
    }
  }

  acceptMission()
  {
    if (confirm("Are you sure you want to accept this mission?")) {
      let accepted = this.isAcceptor();
      if (!accepted && (!this.mission.on_mission || (this.mission.max_acceptors <= this.mission.on_mission.length + 1))) {
        this.jobBoardService.accept(this.mission.id).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.mission = results
              this.jobBoardService.refreshData()
            }
          }
        )
      } else {
        this.messageService.addInfo("You have already accepted this mission!")
      }
    }
  }

  abandonMission()
  {
    if (confirm("Are you sure you want to abandon this mission?")) {
      if (this.isAcceptor()) {
        this.jobBoardService.abandon(this.mission.id).subscribe(
          (results) => {
            if (!(results instanceof HttpErrorResponse)) {
              this.mission = results
              this.jobBoardService.refreshData()
            }
          }
        )
      } else {
        this.messageService.addInfo("You have not accepted this mission!")
      }
    }
  }

  isAcceptor() : boolean
  {
      return (this.mission.on_mission && this.mission.on_mission.find(x => x.id == (this.authService.retrieveUserSession() as UserSessionResponse).character.id )) ? true : false
  }

  ngOnInit() {
  }

}
