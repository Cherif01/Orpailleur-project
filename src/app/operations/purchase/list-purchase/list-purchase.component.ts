import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseService } from '../purchase.service';
import { Location } from '@angular/common';
import { DialogMessageComponent } from 'src/app/public/dialogs/dialog-message/dialog-message.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-list-purchase',
  templateUrl: './list-purchase.component.html',
  styleUrls: ['./list-purchase.component.css']
})
export class ListPurchaseComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private purchaseService: PurchaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  upDown = true
  title = "Achat";
  items: any[] = []
  dataAchat: any[] = []
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["created_at", "fournisseur", "telephone", "poids_total" ,"carrat_achat", "action"];


  ngOnInit(): void {
    this.getPurchaseListe();
  }

  onSubscribePurchage: any
  getPurchaseListe() {
    this.purchaseService.LISTFournisseurAchat('fournisseur', 'read.php')
      .subscribe(data => {
        // console.log("Achat : ", data);
        this.dataSource.data = data
        this.dataSource.paginator = this.paginator;
      });
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }


  deleteAchat(idAchat_: any) {
    // console.log('id:', this.Id_achat);

    this.dialog.open(DialogMessageComponent, {
      disableClose: true,
      data: {
        title: "Supprimer l'achat'",
        message: "Voulez-vous vraiment supprimer cet achat? ",
        messageNo: "Annuler",
        messageYes: "Supprimer"
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        // console.log(data);
        this.purchaseService.deleteByID('achat', 'delete.php', idAchat_)
          .subscribe({
            next: (value) => {
              console.log("res : ", value);
              // this.PTotal_this =
              // this.router.navigate(['/operation/purchase/'])
              window.location.reload()
            },
            error: (err) => {
              console.error(err);
            }
          });
      }
    })
    //Requete suppression sur la DB
  }

}
