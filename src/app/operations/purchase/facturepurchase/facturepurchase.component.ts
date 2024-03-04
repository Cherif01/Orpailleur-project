import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PurchaseService } from '../purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { generatePDF, imprimerDiv } from 'src/app/app.component';


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
    private service: ApiserviceService,
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
  InfoAchat2: any = {}
  NameF: string = ""
  AdresseF: string = ""

  Poids_total: number = 0
  carrat_moyenne: number = 0
  nbBarres: number = 0
  getItemAchat() {
    this.service.getUnique('achat', 'getItem.php', this.ID_ACHAT_GET).subscribe({
      next: (data) => {
        if (data.length > 0) {
          console.log("item ", data);
          this.ACHAT_TAB = data
          this.Poids_total = 0
          this.carrat_moyenne = 0
          this.InfoAchat = data[0];
          data.forEach((item) => {
            this.nbBarres += 1
            // this.Poids_total += item.poidsItem
            // this._MANQUANT_ += item.manquantItem
            // this.carrat_moyenne += (item.poidsItem * (item.carratItem - item.manquantItem))
          })
        }
      }
    })

    this.service.getUnique('achat', 'getOne.php', this.ID_ACHAT_GET)
      .subscribe({
        next: (data) => {
          console.log("Donnees : ", data);
          this.InfoAchat2 = data;
        },
        error: (err) => console.error("Erreur : ", err)

      })
  }


  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }

  generatePDF(nameFournisseur? : string) {
    generatePDF(nameFournisseur);
  }

  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }


}
