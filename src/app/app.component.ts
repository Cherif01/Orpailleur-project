import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Groupe - LIMANAYA _ BUSINESS';
  loginUsername = localStorage.setItem("Username", "admin")
  loginPassword = localStorage.setItem("Username", "admin")
  public sessionUSER: any = window.localStorage.setItem("USERNAME", "admin")
  canShowMenu = true;
  constructor(
    public location: Location,
    private router: Router
  ){
    this.router.events
    .pipe(
      filter((event: any) => event instanceof NavigationEnd)
    )
    .subscribe((event: NavigationEnd) => {
      // `event.url` contient l'URL actuelle
      this.canShowMenu = event.url !== '/user/login';
      // Vous pouvez effectuer des vérifications supplémentaires ici
    });
  }


}
