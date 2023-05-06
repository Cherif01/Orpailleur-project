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

  title = 'Stock Principale'
  selectedValue: string = '';
  selectedCar: string = '';

  // GET ACHAT FOURNISSEUR
  TabItems: any[] = [];
  STOCK_PRINCIPALE_ENTRER: number = 0
  TabItems_du_jour: number = 0
  STOCK_PRINCIPALE_DU_JOUR: number = 0
  TabExpedition_du_jour: any = []
  QTE_EXPEDIER: number = 0


  constructor(
    private activeroute: ActivatedRoute,
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
    this.serviceEntreprise.getList('api', 'fixing').subscribe({
      next: (data_: any) => {
        // console.log(data)
        data_.forEach((item: any) => {
          let dateDB_ = new Date(item.created_at)
          if(item.status == 2){
            if (dateDB_.getDay() == this.Today_h.getDay()) {
              this.TabItems_du_jour += item.poids_fixe
            }
            this.TabItems.push(item.poids_fixe)
          }
        });
        this.STOCK_PRINCIPALE_ENTRER = this.TabItems.reduce((acc, item) => acc + item,0)
        this.STOCK_PRINCIPALE_DU_JOUR = this.TabItems_du_jour;
      }
    })

    // GET EXPEDITION
    this.serviceEntreprise.getList2('client_api', 'vente').subscribe({
      next: (data_: any) => {
        // console.log(data_)
        data_.forEach((item: any) => {
          let dateDB_2 = new Date(item.created_at)
          if(item.status == 2){
            this.serviceEntreprise.getAllByClause('client_api', 'vente_detail', 'vente.id', item.id)
            .subscribe({
              next: (d => {
                // console.log(d);
                d.forEach((k: any) => {
                  if (dateDB_2.getDay() == this.Today_hExp.getDay()) {
                    // console.log(item);
                    this.TabExpedition_du_jour.push(k.achat_item.poids_achat)
                    this.QTE_EXPEDIER += k.achat_item.poids_achat
                    console.log(this.TabExpedition_du_jour);
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
