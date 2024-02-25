import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let session = localStorage.getItem('session');
    let role = localStorage.getItem('role');
    let user_state = localStorage.getItem('state');
    let username = localStorage.getItem('username');
    if (!session && !role && !user_state && !username){
      this.router.navigateByUrl('/user/login');
      return false;
    }
    return true;
  }

}
