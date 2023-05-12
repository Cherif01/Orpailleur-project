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
  listLotHistory: any[] = [];
  listLot: any[] = [];
  listAttribution: any

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
        const todayDate = new Date().toLocaleDateString();
        console.log(todayDate);
        data.forEach((item: any) => {
          const dbDate = new Date(item.created_at).toLocaleDateString();
          // console.log(dbDate);
          if (todayDate == dbDate) {
            // console.log("Egale");
            this.listLot.push(item)
          }else{
            this.listLotHistory.push(item)
            // console.log("Different");
          }
        })
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
