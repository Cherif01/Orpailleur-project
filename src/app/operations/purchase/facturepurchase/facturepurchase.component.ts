import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-facturepurchase',
  templateUrl: './facturepurchase.component.html',
  styleUrls: ['./facturepurchase.component.css']
})
export class FacturepurchaseComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  constructor(
    private activeroute: ActivatedRoute,
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar,
    public location: Location,
  ) { }

  title = "Facture d'achat..."
  items: any = []
  ID_ACHAT_GET: any = 0
  ACHAT_TAB: any = []
  SLUG_ACHAT: any = ""

  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_ACHAT_GET = this.activeroute.snapshot.params['id'];
    this.getAchat()
    this.getItems()
  }

  onSubscribePurchage: any
  InfoAchat: any = {}
  NameF: string = ""
  AdresseF: string = ""
  getAchat() {
    this.onSubscribePurchage = this.purchaseService
      .getList('api', 'achat')
      .pipe(
        map(data => {
          let result: any[] = [];
          // console.log(data)
          data.forEach(item => {
            // let index = result.findIndex(i => i.slug === item.slug);
            if (this.ID_ACHAT_GET == item.id) {
              this.InfoAchat = item;
              // console.log(item);
              this.NameF = item.fournisseur.prenom + " " + item.fournisseur.nom
              this.AdresseF = item.fournisseur.adresse + " " + item.fournisseur.telephone
              result.push(item);
              // console.log(this.InfoAchat);
            } else {
              // result[index].poids_achat += item.poids_achat;
            }
          });
          // console.log(this.dataSource.data);
          return result;
        })
      )
      .subscribe(data => {
        // this.ACHAT_TAB = data;
      });

  }


  // Get ITEMS ACHAT
  onSubscribePurchage2: any
  Poids_total: number = 0
  carrat_moyenne: number = 0
  nbBarres: number = 0
  getItems() {
    this.onSubscribePurchage2 = this.purchaseService
      .getList('api', 'achat_items')
      .pipe(
        map(data => {
          let result: any[] = [];
          console.log(data)
          data.forEach(item => {
            // let index = result.findIndex(i => i.slug === item.slug);
            if (this.ID_ACHAT_GET == item.achat.id) {
              console.log(item);
              this.Poids_total += item.poids_achat
              this.carrat_moyenne += (item.poids_achat * item.carrat_achat)
              this.nbBarres += 1
              result.push(item);
            } else {
              // result[index].poids_achat += item.poids_achat;
            }
          });
          // console.log(this.dataSource.data);
          // console.log(result);
          return result;
        })
      )
      .subscribe(data => {
        this.ACHAT_TAB = data;
      });
  }


  imprimerDiv(): void {
    let printContents = this.divToPrint.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }




  // getItems2(){
  //   this.purchaseService.getDetailPurchaseItems(this.SLUG_ACHAT).subscribe({
  //     next: (data: any) =>{
  //       console.log(data);
  //     }
  //   })
  // }

}
