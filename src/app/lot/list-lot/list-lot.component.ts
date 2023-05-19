import { Component, OnInit } from '@angular/core';
import { LINK_BASE } from 'src/app/config';
import { LotService } from '../lot.service';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-lot',
  templateUrl: './list-lot.component.html',
  styleUrls: ['./list-lot.component.css']
})
export class ListLotComponent implements OnInit {
  constructor(
    private serviceLot: LotService,
    private snackBar: MatSnackBar,
    public location: Location
  ) {

  }

  displayedColumns = ['Date', 'Docs', 'Designation', 'Status', 'Action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  displayedColumns_maj = ['Date', 'Poids', 'Carrat', 'Manquant'];
  dataSource_maj: MatTableDataSource<any> = new MatTableDataSource();

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.dataSource_maj.filter = filterValue.trim().toLowerCase();
  }

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
  allLot: any[] = []
  getLot() {
    this.serviceLot.getList(LINK_BASE, 'arrivage').subscribe({
      next: (data) => {
        // console.log(data);
        const todayDate = new Date().toLocaleDateString();
        // console.log(todayDate);
        data.forEach((item: any) => {
          const dbDate = new Date(item.created_at).toLocaleDateString();
          // console.log(dbDate);
          this.allLot.push(item)
          if (todayDate == dbDate) {
            // console.log("Egale");
            this.listLot.push(item)
          } else {
            this.listLotHistory.push(item)
            // console.log("Different");
          }
        })
        this.dataSource.data = data;
      }
    })
  }

  listLotEvent(idLotSelect: any) {
    // console.log(idLotSelect);
    this.serviceLot.getLotContentById(LINK_BASE, 'arrivage', idLotSelect).subscribe({
      next: (data: any) => {
        // console.log(data.data);
        this.dataSource_maj.data = data.data;
      }
    })

  }

  saveTableData(element: any) {
    console.log("Row : ", element);
    this.serviceLot.updateRows(element)
      .subscribe({
        next: (response) => {
          this.snackBar.open("Manquant modifier avec succès!", undefined, {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: ['bg-success', 'text-white']

          });
        },
        error: (err) => {
          this.snackBar.open("Echec, Veuillez reessayer!", undefined, {
            duration: 1000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })

    // Traitez les données modifiées ici
  }

  playSound() {
    const audio = new Audio();
    audio.src = 'assets/click/click3.wav';
    audio.load();
    audio.play();
  }

}
