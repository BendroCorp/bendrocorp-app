import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MenuItem } from '../models/misc-models';
import { MenuService } from './menu.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { ErrorService } from '../error.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {
  
  menuItems:MenuItem[]
  menuVisible:boolean = false
  authSubscription:Subscription
  authErrorSubscription:Subscription
  constructor(private authService:AuthService, private menuService:MenuService, private errorService:ErrorService) { 
    this.authErrorSubscription = this.errorService.authErrorAnnounced$.subscribe(
      called => {
        console.log("Menu observed auth service call!");
        
        this.checkAuthAndLoadMenu()
      }
    )

    this.authSubscription = this.authService.dataRefreshAnnounced$.subscribe(
      called => {
        console.log("Menu observed auth service call!");
        
        this.checkAuthAndLoadMenu()
      }
    )
  }

  checkAuthAndLoadMenu()
  {
    if (this.authService.isLoggedIn()) {
      this.menuService.list().subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.menuVisible = true
            this.menuItems = results
            console.log(this.menuItems);
            
          }
        }
      )
    } else {
      this.menuVisible = false
      this.menuItems = null
    }
  }
  
  ngOnInit() {
    this.checkAuthAndLoadMenu()
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe()
    this.authErrorSubscription.unsubscribe()
  }

}
