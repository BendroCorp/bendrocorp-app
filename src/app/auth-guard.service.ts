import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class NoAuthGuardService implements CanActivate {
  constructor(private router: Router, private authService:AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      return true
    } else {
      this.authService.refreshData()
      this.router.navigate(['/']);
      return false;
    }
  }

}

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService:AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true
    } else {
      this.authService.refreshData()
      this.router.navigate(['/login']);
      return false;
    }
  }
}

@Injectable()
export class RoleRequiredAuthGuardService implements CanActivate {
  constructor(public roleId:number, private router: Router, private authService:AuthService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return (this.authService.hasClaim(this.roleId)) ? true : false
    } else {
      this.authService.refreshData()
      this.router.navigate(['/login']);
      return false;
    }
  }
}

