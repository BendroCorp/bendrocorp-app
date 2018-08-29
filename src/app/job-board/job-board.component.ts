import { Component, OnInit } from '@angular/core';
import { JobBoardService } from './job-board.service';
import { MessageService } from '../message/message.service';
import { AuthService } from '../auth.service';
import { JobBoardMission } from '../models/job-board-models';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-job-board',
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css']
})
export class JobBoardComponent implements OnInit {
  isAdmin:boolean = this.authService.hasClaim(28)
  subscription:Subscription
  missions:JobBoardMission[] = []

  constructor(private jobBoardService:JobBoardService, private authService:AuthService, private messageService:MessageService) { 
    this.subscription = this.jobBoardService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchMissions()
      }
    )
  }

  fetchMissions()
  {
    this.jobBoardService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.missions = results //as JobBoardMission[]
        }
      }
    )
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

  ngOnInit() {
    this.fetchMissions()
  }

}
