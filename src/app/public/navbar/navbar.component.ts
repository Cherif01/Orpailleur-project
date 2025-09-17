import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  daysRemaining: any = 3

  constructor (private router: Router) {}

  sessionName: any = localStorage.getItem('nomComplet')
  sessionID: any = localStorage.getItem('id')

  daysLeft = 365
  private decrementInterval: any

  ngOnInit (): void {
    this.startCountdown()
    this.updateTimer()
    this.decrementInterval = setInterval(() => this.decrementDays(), 86400000) // 24 heures
  }

  updateTimer (): void {
    // La logique pour mettre à jour l'affichage peut être plus complexe si nécessaire
  }

  decrementDays (): void {
    if (this.daysLeft > 0) {
      this.daysLeft -= 1
    } else {
      clearInterval(this.decrementInterval) // Arrêter le chronomètre lorsque le compte atteint 0
      alert('Le chronomètre est terminé')
    }
  }

  logout () {
    localStorage.removeItem('session')
    localStorage.removeItem('id')
    localStorage.removeItem('role')
    localStorage.removeItem('username')
    localStorage.removeItem('state')
    localStorage.removeItem('nomComplet')
    this.router.navigate(['/user/login'])
  }

  startCountdown (): void {
    const countdownInterval = setInterval(() => {
      if (this.daysRemaining > 0) {
        this.daysRemaining--
      } else {
        clearInterval(countdownInterval)
      }
    }, 24 * 60 * 60 * 1000) // 24 heures en millisecondes
  }
}
