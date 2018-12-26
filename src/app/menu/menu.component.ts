import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { MenuItem } from '../models/misc-models';
import { MenuService } from './menu.service';
import { HttpErrorResponse } from '../../../node_modules/@angular/common/http';
import { ErrorService } from '../error.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(private router:Router, private authService:AuthService, private menuService:MenuService, private errorService:ErrorService) { 
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

  isActiveItem(linkPath: string) {
    if (linkPath === '/') {
      return (this.router.url === '/') ? true : false
    } else {
      return (this.router.url.indexOf(linkPath) != -1) ? true : false
    }
  }

  nonNestedMembers() {
    if (this.menuItems) {
      return this.menuItems.filter(x => !x.nested_under_id)
    } 
  }

  nestedItemsForMember(menuItemId: number) {
    if (menuItemId && this.menuItems) {
      return this.menuItems.filter(x => x.nested_under_id === menuItemId)
    }
  }

  checkAuthAndLoadMenu()
  {
    if (this.authService.isLoggedIn() && this.authService.hasClaim(0)) {
      this.menuService.list().subscribe(
        (results) => {
          if (!(results instanceof HttpErrorResponse)) {
            this.menuVisible = this.authService.hasClaim(0) // ie. is a member of BendroCorp
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
