import { Component, OnInit } from '@angular/core';
import { BanqueService } from '../banque.service';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.css']
})
export class ListAccountComponent implements OnInit {

  constructor(
    private serviceBank: BanqueService
  ) { }

  title = "List Account"
  List: any = []

  ngOnInit(): void {
    this.getAllParticulier()
  }

  getAllParticulier(): void {
    this.serviceBank.getList('particulier_api', 'particulier').subscribe({
      next: (data: any) => {
        console.log(data),
        this.List = data
      },
      error: (err: any) => console.log(err)
    })
  }

  playSound() {
    const audio = new Audio();
    audio.src = 'assets/click/click2.wav';
    audio.load();
    audio.play();
  }

}
