import { Component, OnInit } from '@angular/core';
import { LotService } from '../lot.service';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';

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

  ngOnInit(): void {
    this.getLot()
  }

  // GET LOT
  // PoidTotalLot: number = 0
  allLot: any[] = []
  getLot() {
    this.serviceLot.LIST('public', 'read.php', 'table_lot').subscribe({
      next: (data: any) => {
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
            this.dataSource.data = data
          }
        })
      }
    })
  }

  listLotEvent(idLotSelect: any) {
    // console.log(idLotSelect);
    this.serviceLot.getOneByIdSimple('lot', 'item_by_lot.php', idLotSelect).subscribe({
      next: (data: any) => {
        console.log(data);
        this.dataSource_maj.data = data;
      }
    })

  }

  saveTableData(element: any) {
    console.log("Row : ", element);
    let obj = {
      id: element.idItem,
      poidsItem: element.poidsItem,
      carratItem: element.carratItem,
      manquantItem: element.manquantItem,
    }
    const objetForm = convertObjectInFormData(obj)
    // console.log("NEW OBJET : ", obj);

    this.serviceLot.UpdateItem('achat', 'updateItem.php', objetForm)
      .subscribe({
        next: (response) => {
          // console.log("res : ", response);
          this.snackBar.open("colonne modifier avec succès!", undefined, {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: ['bg-success', 'text-white']

          });
        },
        error: (err) => {
          console.error("err : ", err);
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
