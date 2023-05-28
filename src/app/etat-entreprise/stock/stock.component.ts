import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EntrepriseService } from '../entreprise.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  title = 'Detail du stock'
  selectedValue: string = '';
  selectedCar: string = '';

  // GET ACHAT FOURNISSEUR
  STOCK_PRINCIPALE_ENTRER_DU_JOUR: number = 0
  QTE_EXPEDIER: number = 0
  QTE_DIPONIBLE: number = 0


  constructor(
    private serviceEntreprise: EntrepriseService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.getSTOCKINFO()
  }



  Today_h: Date = new Date()
  Today_hExp: Date = new Date()
  getSTOCKINFO(): void {
    // console.log(this.objetFRS)
    this.serviceEntreprise.getInfoStockAPI('api', 'fournisseur', 1).subscribe({
      next: (data_: any) => {
        console.log(data_)
        this.STOCK_PRINCIPALE_ENTRER_DU_JOUR = data_.poids_dans_fixing_detail
        this.QTE_EXPEDIER = data_.poids_dans_expedition
        this.QTE_DIPONIBLE = data_.poids_actif
      }
    })

    // GET EXPEDITION
    this.serviceEntreprise.getList2('client_api', 'vente').subscribe({
      next: (data_: any) => {
        // console.log(data_)
        data_.forEach((item: any) => {
          let dateDB_2 = new Date(item.created_at)
          if (item.status == 2) {
            this.serviceEntreprise.getAllByClause('client_api', 'vente_detail', 'vente.id', item.id)
              .subscribe({
                next: (d => {
                  // console.log(d);
                  d.forEach((k: any) => {
                    if (dateDB_2.getDay() == this.Today_hExp.getDay()) {
                      // console.log(item);
                      this.QTE_EXPEDIER += 0
                    }
                  })
                })
              })
          }
        });
        // console.log(this.TabItems);
        // this.QTE_EXPEDIER = this.TabExpedition_du_jour.reduce((acc: any, item: any) => acc + item)
        // this.QTE_EXPEDIER = 0
      }
    })
    // FIN EXPEDITION
  }

}
