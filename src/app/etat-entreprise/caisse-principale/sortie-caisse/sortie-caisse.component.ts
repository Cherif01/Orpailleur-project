import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { EntrepriseService } from '../../entreprise.service';
import { CaisseOptDialogSortieComponent } from '../caisse-opt-dialog-sortie/caisse-opt-dialog-sortie.component';

@Component({
  selector: 'app-sortie-caisse',
  templateUrl: './sortie-caisse.component.html',
  styleUrls: ['./sortie-caisse.component.css']
})
export class SortieCaisseComponent implements OnInit {

  title = 'Sortie de caisse'

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
    this.dialog.open(CaisseOptDialogSortieComponent, {
    }).afterClosed()
      .subscribe((result) => {
        this.hideSolde()
        if (result?.event && result.event === "insert") {
          if (result.data.devise == 1) {
            result.data.montant_anterieur = this.GNFAmount
          } else {
            result.data.montant_anterieur = this.USDAmount
          }
          console.log(result.data);
          this.serviceEntreprise.Add(result.data, 'api', 'caisse')
            .subscribe({
              next: (data => {
                this.snackBar.open("Sortie en caisse de : " + result.data.montant + " effectuer avec success", "Okay", { duration: 4000 })
                this.historiqueSortie.push(data)
                // this.getCaisse()
              })
            })

        }
      })
  }


  // CAISSE ELEMENT
  historiqueSortie: any = []
  Today_h: Date = new Date()
  getCaisse(): void {
    this.serviceEntreprise.getList('api', 'caisse')
      .subscribe({
        next: ((data: any) => {
          data.forEach((item: any) => {
            // console.log(item);
            let dateDB_ = new Date(item.created_at)
            if (item.operation == 2 || item.operation == 4) {
              if (dateDB_.getDay() == this.Today_h.getDay()) {
                this.historiqueSortie.push(item)
              }
            }
          })
        })
      })
  }


  // VOIR LE SOLDE

  GNFAmount: number = 0
  USDAmount: number = 0
  //
  GNFAmount_: number = 0
  USDAmount_: number = 0
  //
  viewSOLDE: any = false
  GNFs: number = 0
  GNFe: number = 0
  GNF: number = 0
  //
  USDs: number = 0
  USDe: number = 0
  USD: number = 0
  Today: Date = new Date()
  showSolde(): void {
    //
    this.viewSOLDE = true
    this.GNFe = 0
    this.USDs = 0
    this.GNFs = 0
    this.USDe = 0
    //
    this.GNF = 0
    this.USD = 0
    this.serviceEntreprise.getList('api', 'caisse')
      .subscribe({
        next: ((data: any) => {
          data.forEach((item: any) => {
            console.log(item);
            let dateDB = new Date(item.created_at)
            if (item.operation == 2 || item.operation == 4) {
              if (item.devise == 1) {
                this.GNFs += parseFloat(item.montant)
                if (dateDB.getDay() == this.Today.getDay()) {
                  this.GNF += parseFloat(item.montant)
                }
              }
              if (item.devise == 2) {
                this.USDs += parseFloat(item.montant)
                if (dateDB.getDay() == this.Today.getDay()) {
                  this.USD += parseFloat(item.montant)
                }
              }
            } else if (item.operation == 1 || item.operation == 3) {
              if (item.devise == 1) {
                this.GNFe += parseFloat(item.montant)
              }
              if (item.devise == 2) {
                this.USDe += parseFloat(item.montant)
              }
            }
          })
          this.GNFAmount = this.GNFe - this.GNFs
          this.USDAmount = this.USDe - this.USDs
          this.GNFAmount_ = this.GNF
          this.USDAmount_ = this.USD
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

