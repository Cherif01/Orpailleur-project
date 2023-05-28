import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    this.getItemAchat()
  }

  onSubscribePurchage: any
  InfoAchat: any = {}
  NameF: string = ""
  AdresseF: string = ""

  Poids_total: number = 0
  carrat_moyenne: number = 0
  nbBarres: number = 0
  getItemAchat() {
    this.purchaseService.getItemsOfAchat('api', 'achat_items', this.ID_ACHAT_GET)
      .subscribe({
        next: (data) => {
          this.ACHAT_TAB = data
          data.forEach(item => {
            this.InfoAchat = item.achat;
            this.Poids_total += parseFloat(item.poids_achat)
            this.carrat_moyenne += (parseFloat(item.poids_achat) * (parseFloat(item.carrat_achat) - parseFloat(item.manquant)))
            this.nbBarres += 1
            this.NameF = item.achat.fournisseur.prenom + " " + item.achat.fournisseur.nom
              this.AdresseF = item.achat.fournisseur.adresse + " / " + item.achat.fournisseur.telephone
          })
          // console.log("Achat items list : ", data);
        }
      })
  }


  imprimerDiv(): void {
    let printContents = this.divToPrint.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


}
