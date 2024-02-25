import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  daysRemaining: any = 3

  constructor(
    private router: Router,
  ) { }

  sessionName: any = localStorage.getItem('nomComplet')
  sessionID: any = localStorage.getItem('id')

  ngOnInit(): void {
    this.startCountdown();
  }

  logout(){
    localStorage.removeItem('session');
    localStorage.removeItem('id');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('state');
    localStorage.removeItem('nomComplet');
    this.router.navigate(['/user/login']);
  }

  startCountdown(): void {
    const countdownInterval = setInterval(() => {
      if (this.daysRemaining > 0) {
        this.daysRemaining--;
      } else {
        clearInterval(countdownInterval);
      }
    }, 24 * 60 * 60 * 1000); // 24 heures en millisecondes
  }

}
