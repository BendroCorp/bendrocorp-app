import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoleService } from './role.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Role, NestedRole } from '../models/user-models';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { MessageService } from '../message/message.service';
import { SpinnerService } from '../misc/spinner/spinner.service';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, OnDestroy {
  roles: Role[] = []
  selectedRole: Role
  newRole: Role = { } as Role
  roleInProgress: boolean = false
  newNestedRoleId: number
  nestedRoleInProgress: boolean = false
  subscription: Subscription
  dataLoaded: boolean
  allowedAccess: boolean = this.authService.hasClaim(37)

  constructor(private roleService:RoleService, private authService: AuthService, private router: Router, private messageService: MessageService, private spinnerService:SpinnerService) {
    this.subscription = this.roleService.dataRefreshAnnounced$.subscribe(
      () => {
        this.fetchRoles()
      }
    )
  }

  selectRole(role: Role) {
    this.selectedRole = role
  }

  deselectRole() {
    this.selectedRole = null
  }

  addRole() {
    if (this.newRole.id && !isNaN(parseInt(this.newRole.id.toString())) && this.newRole.name) {
      this.roleInProgress = true
      this.roleService.createRole(this.newRole).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.messageService.addSuccess('Role added!')
            this.roles.push(results)
            this.newRole = { id: this.roles.length + 2 } as Role
          }
          this.roleInProgress = false
        }
      )
    } else {
      this.messageService.addError('Cannot add role. Please complete the form')
    }
  }

  updateRole(role: Role) {
    console.log(role);
    
    if (role && role.id) {
      this.roleService.updateRole(role).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            // we may not actually have to do anything here
          }
        }
      )
    }
  }

  addNestedRole() {
    this.nestedRoleInProgress = true
    this.roleService.createNestedRole(this.selectedRole.id, this.newNestedRoleId).subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.selectedRole.nested_roles.push(results)
        }
        this.nestedRoleInProgress = false
      }
    )
  }

  removeNestedRole(nestedRole: NestedRole) { 
    if (confirm('Are you sure you want to remove this nested role?')) {
      this.roleService.removeNestedRole(nestedRole).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            const nestedIndex = this.selectedRole.nested_roles.findIndex(x => x.id === nestedRole.id)
            if (nestedIndex != -1) {
              this.selectedRole.nested_roles.splice(nestedIndex, 1)
            }
          }
        }
      )
    }
  }

  fetchRoles() {
    this.roleService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          this.roles = results
          this.newRole = { id: this.roles.length + 2 } as Role
          this.dataLoaded = true
          this.spinnerService.spin(false)
          console.log(this.roles)
        }
      }
    )
  }

  filteredNestedRoles() {
    if (this.selectedRole) {
      let filtered = []
      for (let index = 0; index < this.roles.length; index++) {
        const role = this.roles[index];
        const isNested = this.selectedRole.nested_roles.find(x => x.role_nested_id == role.id)
        if (!isNested) {
          filtered.push(role)
        }
      }
      
      return filtered.sort((a,b) => {
        return ('' + a.name).localeCompare(b.name);
      })
    }
  }

  ngOnInit() {
    if (this.allowedAccess) {
      this.spinnerService.spin(true)
      this.fetchRoles()
    } else {
      console.error('You do not have permission to access roles.')
      this.messageService.addError('You do not have permission to access this page.')
      this.router.navigateByUrl('/')
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }

}
