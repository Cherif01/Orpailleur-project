import { Component, OnInit } from '@angular/core';
import { LINK_BASE } from 'src/app/config';
import { LotService } from '../lot.service';
import { Location } from '@angular/common';
// import './scrip.js'

@Component({
  selector: 'app-list-lot',
  templateUrl: './list-lot.component.html',
  styleUrls: ['./list-lot.component.css']
})
export class ListLotComponent implements OnInit {

  constructor(private serviceLot: LotService, public location: Location) { }
  title = "Lot"
  listLot: any
  listAttribution: any
  currentDate = new Date();

  ngOnInit(): void {
    this.getAttribution()
    this.getLot()
  }

  // GET Arrivage
  getAttribution() {
    this.serviceLot.getAttribution('api', 'arrivage').subscribe({
      next: (data) => {
        this.listAttribution = data
        // console.log(data)
      }
    })
  }

  // GET LOT
  // PoidTotalLot: number = 0
  getLot() {
    this.serviceLot.getList(LINK_BASE, 'arrivage').subscribe({
      next: (data) => {
        this.listLot = data
      }
    })
  }


  playSound() {
    const audio = new Audio();
    audio.src = 'assets/click/click3.wav';
    audio.load();
    audio.play();
  }

}
