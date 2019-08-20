import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../message/message.service';
import { UserService } from '../../user.service';
import { RequestsService } from '../requests.service';
import { User } from '../../models/user-models';
import { RemoveRoleRequest } from '../../models/request-models';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-remove-role',
  templateUrl: './remove-role.component.html',
  styleUrls: ['./remove-role.component.css']
})
export class RemoveRoleComponent implements OnInit {
  removeRoleRequest:RemoveRoleRequest = { } as RemoveRoleRequest
  users:User[] = []
  selectedUser:User
  requestSubmitting:boolean = false

  constructor(private messageService:MessageService, private userService:UserService, private requestService:RequestsService) { }

  submitremoveRoleRequest()
  {
    if (this.removeRoleRequest && (this.removeRoleRequest.on_behalf_of_id && this.removeRoleRequest.role_id)) {
      console.log(this.removeRoleRequest);
      
      this.requestSubmitting = true
      this.requestService.removeRoleRequest(this.removeRoleRequest).subscribe(
        (results) => {
          this.requestSubmitting = false
          if (!(results instanceof HttpErrorResponse)) {
            this.removeRoleRequest = { } as RemoveRoleRequest
            this.selectedUser = null
            this.messageService.addSuccess("Remove role request successfully submitted!")
          }
        }
      )
    }
  }

  roleList()
  {
    this.selectedUser = this.users.find(x => x.main_character.id == this.removeRoleRequest.on_behalf_of_id)
  }

  ngOnInit() {
    this.userService.list().subscribe(
      (results) => {
        console.log(results);        
        this.users = results
        .filter(x => x.main_character)
        .sort((a,b) => {
          return ('' + a.main_character.first_name).localeCompare(b.main_character.first_name);
        })
      }
    )
  }

}
