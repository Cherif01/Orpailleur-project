import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaisseDialogComponent } from './caisse-dialog/caisse-dialog.component';
import { EntrepriseService } from '../entreprise.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-caisse-principale',
  templateUrl: './caisse-principale.component.html',
  styleUrls: ['./caisse-principale.component.css']
})
export class CaissePrincipaleComponent implements OnInit {

  title = 'Caisse Principale'

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private dialog: MatDialog,
    private serviceEntreprise: EntrepriseService,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["date"];


  ngOnInit(): void {
    this.getCaisse()
  }
  openDialog() {
    this.showSolde()
    this.dialog.open(CaisseDialogComponent, {
    }).afterClosed()
      .subscribe((result) => {
        this.hideSolde()
        // console.log(this.GNFAmount);
        // console.log(this.USDAmount);
        if (result?.event && result.event === "insert") {
          if(result.data.devise == 1){
            result.data.montant_anterieur = this.GNFAmount
          }else{
            result.data.montant_anterieur = this.USDAmount
          }
          // console.log(result.data);
          this.serviceEntreprise.Add(result.data, 'api', 'caisse')
            .subscribe({
              next: (data => {
                this.snackBar.open("Operation effectuer avec success", "Okay", { duration: 3000 })
                this.historique.push(data)
                // this.getCaisse()
              }),
              error: (err) => {
                this.snackBar.open("Erreur, pendant l'operation...", "Okay", { duration: 3000 })
              }
            })

        }
      })
  }


  // CAISSE ELEMENT
  historique: any = []
  Today_h: Date = new Date()
  getCaisse(): void {
    this.serviceEntreprise.getList('api', 'caisse')
      .subscribe({
        next: ((data: any) => {
          data.forEach((item: any) => {
            // console.log(item);
            // let dateDB_ = new Date(item.created_at)
            // if (dateDB_.getDay() == this.Today_h.getDay()) {
            // }
            this.historique.push(item)
          })
        })
      })
  }


  // VOIR LE SOLDE

  GNFAmount: number = 0
  USDAmount: number = 0
  viewSOLDE: any = false
  GNFe: number = 0
  GNFs: number = 0
  USDe: number = 0
  USDs: number = 0
  Today: Date = new Date()

  showSolde(): void {
    //
    this.viewSOLDE = true
    this.GNFe = 0
    this.GNFs = 0
    this.USDe = 0
    this.USDs = 0
    this.serviceEntreprise.getList('api', 'caisse')
      .subscribe({
        next: ((data: any) => {
          data.forEach((item: any) => {
            let dateDB = new Date(item.created_at)
            if (item.operation == 1 || item.operation == 3) {
              if (item.devise == 1) {
                this.GNFe += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
              if (item.devise == 2) {
                this.USDe += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
            }
            // SORTIE
            if (item.operation == 2 || item.operation == 4) {
              if (item.devise == 1) {
                this.GNFs += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
              if (item.devise == 2) {
                this.USDs += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
            }
          })
          this.GNFAmount = this.GNFe - this.GNFs
          this.USDAmount = this.USDe - this.USDs
        })
      })
    //
  }

  hideSolde(): void {
    //
    this.viewSOLDE = false
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}

