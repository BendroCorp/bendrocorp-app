import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JobBoardMission, JobBoardMissionCompletionRequest } from '../../models/job-board-models';
import { AuthService } from '../../auth.service';
import { JobBoardService } from '../job-board.service';
import { UserSessionResponse } from '../../models/user-models';
import { MessageService } from '../../message/message.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FlightLogService } from '../../flight-logs/flight-log.service';
import { FlightLog } from '../../models/flight-log-models';

@Component({
  selector: 'complete-job-modal',
  templateUrl: './complete-job-modal.component.html',
  styleUrls: ['./complete-job-modal.component.css']
})
export class CompleteJobModalComponent implements OnInit {
  @Input() mission:JobBoardMission
  completionRequest:JobBoardMissionCompletionRequest
  flightLogs:FlightLog[] = []
  openModal:NgbModalRef
  constructor(private modalService: NgbModal, private authService:AuthService, private jobBoardService:JobBoardService, private flightLogService:FlightLogService, private messageService:MessageService) {}

  open(content) {
    this.completionRequest = { mission_id: this.mission.id } as JobBoardMissionCompletionRequest
    this.fetchFlightLogs()
    this.openModal = this.modalService.open(content);
  }

  completeMission()
  {
    if (this.mission && this.isAcceptor() && (this.completionRequest && this.completionRequest.flight_log_id && this.completionRequest.completion_message)) {
      this.completionRequest.mission_id = this.mission.id
      this.jobBoardService.complete(this.completionRequest).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.jobBoardService.refreshData()
            this.openModal.close()
          }
        }
      )
    }
  }

  fetchFlightLogs()
  {
    this.flightLogService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.flightLogs = results
        }
      }
    )
  }

  isAcceptor() : boolean
  {
      return (this.mission.on_mission && this.mission.on_mission.find(x => x.id == (this.authService.retrieveUserSession() as UserSessionResponse).character.id )) ? true : false
  }

  ngOnInit() {
    if (!this.mission && this.mission.id) {
      this.messageService.addError("Mission not passed correctly to completion modal!")
    }
  }

}
