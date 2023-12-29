import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../Services/User.service';

@Injectable({
  providedIn: 'root'
})
export class IsAdminGuard {

  constructor(private userService: UserService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let role = this.userService.decodeJwtToken().payload.scope;
    if (role != "ROLE_ADMIN") {
      window.location.replace("/illus/list");
      return false;
    }
    return true;
  }

}
