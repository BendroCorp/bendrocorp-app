import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/user.service';
import { AdminService } from '../admin.service';
import { User, UserSessionResponse } from '../../models/user-models';
import { SpinnerService } from '../../misc/spinner/spinner.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from 'src/app/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impersonate',
  templateUrl: './impersonate.component.html',
  styleUrls: ['./impersonate.component.css']
})
export class ImpersonateComponent implements OnInit {
  users:User[] = []
  selectedImpersonationUserId:number
  constructor(private userService:UserService, private adminService:AdminService, private spinnerService:SpinnerService, private authService:AuthService, private router:Router) { }

  fetchUsers()
  {
    this.userService.list().subscribe(
      (results) => {
        if (!(results instanceof HttpErrorResponse)) {
          console.log(results)
          this.users = results.filter(x => x.id != (this.authService.retrieveUserSession() as UserSessionResponse).id)
        }
        this.spinnerService.spin(false)
      }
    )
  }

  impersonateUser()
  {
    console.log(this.selectedImpersonationUserId);
    
    if (this.selectedImpersonationUserId) {
      this.adminService.requestImpersonationToken(this.selectedImpersonationUserId).subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.authService.setSession(results).subscribe(
              () => {
                this.authService.refreshData()
                this.router.navigateByUrl('/')
              }
            )
          }
        }
      )
    }
  }

  ngOnInit() {
    this.spinnerService.spin(true)
    this.fetchUsers()
  }

}
