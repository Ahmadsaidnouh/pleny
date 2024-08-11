import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

Injectable({
  providedIn: 'root'
})
export const loginGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree => {
  const router:Router = inject(Router);
  const auth:AuthService = inject(AuthService);
  if (auth.userData.getValue() != null) {
    router.navigate(['home']);
    return false;
  }
  else {
    return true;
  }
};
