import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../message/message.service';
import { UserService } from '../../user.service';
import { AddRoleRequest } from '../../models/request-models';
import { Role, User } from '../../models/user-models';
import { RequestsService } from '../requests.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.css']
})
export class AddRoleComponent implements OnInit {
  addRoleRequest:AddRoleRequest = { } as AddRoleRequest
  roles:Role[] = []
  notInRoles:Role[] = []
  users:User[] = []
  selectedUser:User

  requestSubmitting:boolean = false

  constructor(private messageService:MessageService, private userService:UserService, private requestService:RequestsService) { }

  submitaddRoleRequest()
  {
    if (this.addRoleRequest && (this.addRoleRequest.on_behalf_of_id && this.addRoleRequest.role_id)) {
      this.requestSubmitting = true
      this.requestService.addRoleRequest(this.addRoleRequest).subscribe(
        (results) => {
          this.requestSubmitting = false
          if (!(results instanceof HttpErrorResponse)) {
            this.addRoleRequest = { } as AddRoleRequest
            this.selectedUser = null
            this.messageService.addSuccess("Add role request successfully submitted!")
          }
        }
      )
    }
  }

  roleList()
  {
    
    if (this.addRoleRequest.on_behalf_of_id && this.roles && this.users) {
      // get the selected user
      this.selectedUser = this.users.find(x => x.main_character.id == this.addRoleRequest.on_behalf_of_id)

      if (this.selectedUser) {
        // get the roles the user is not in
        // this.notInRoles = this.roles.filter(x => !this.selectedUser.roles.includes(x))
        for (let index = 0; index < this.roles.length; index++) {
          const role = this.roles[index];
          if (!this.selectedUser.roles.find(x => x.id == role.id)) {
            this.notInRoles.push(role)
          }
        }
      }      
    }
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

    this.userService.list_roles().subscribe(
      (results) => {
        console.log(results);
        this.roles = results
      }
    )
  }

}
