import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/firebase/auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PublicGuard implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router) { }

  public canActivate() {
    if (this.authService.getToken()) {
      this.router.navigate(['/buscador']);
      return false;
    } else {
      return true;
    }
  }

}
