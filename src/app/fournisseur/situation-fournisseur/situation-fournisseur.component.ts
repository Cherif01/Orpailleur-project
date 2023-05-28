import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceService } from '../vendor-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-situation-fournisseur',
  templateUrl: './situation-fournisseur.component.html',
  styleUrls: ['./situation-fournisseur.component.css']
})
export class SituationFournisseurComponent implements OnInit {

  title = 'Situation Fournisseur'
  selectedValue: string = '';
  selectedCar: string = '';
  TYPE_OPERATION = {
    credit: 1,
    debit: 2
  }
  constructor(
    private activeroute: ActivatedRoute,
    private serviceVendor: VendorServiceService,
    public location: Location
  ) { }

  ID_F: any
  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_F = this.activeroute.snapshot.params['id'];
    this.getOneFournisseur()
    this.getInfoSolde()
  }


  objetFRS: any
  // ONE FOURNISSEUR
  getOneFournisseur(): void {
    // this.objetFRS = {}
    if (this.ID_F) {
      this.serviceVendor.getElementById('api', 'fournisseur', this.ID_F).subscribe({
        next: (data) => {
          this.objetFRS = data
        }
      })
    }
  }
  fusionTab: any[] = [];
  TabCaisseOpts: any[] = []
  TabFixingOpts: any[] = []
  baseSoldeUSD: number = 0
  baseSoldeGNF: number = 0
  SoldeGNF: number = 0;
  SoldeUSD: number = 0;
  soldeRetourGNF: number = 0;
  soldeRetourUSD: number = 0;
  soldeDecaissementGNF: number = 0;
  soldeDecaissementUSD: number = 0;
  infoElem: any = {}
  getInfoSolde(): void {
    this.serviceVendor.situationMonetaire('api', 'caisse', this.ID_F)
      .subscribe({
        next: (response: any) => {
          console.log("response", response);
          let dataCaisse: any[] = response.caisse_fournisseur
          let dataFixing: any[] = response.fixing_detail;
          dataCaisse.forEach(v => {
            v['type'] = this.TYPE_OPERATION.debit;
            v['dateNumber'] = new Date(v['created_at']).getTime();
          });
          dataFixing.forEach(v => {
            v['type'] = this.TYPE_OPERATION.credit;
            v['dateNumber'] = new Date(v['created_at']).getTime();
          });
          dataCaisse.concat(dataFixing);
          // console.log("after fusion",dataCaisse);
          this.fusionTab = dataCaisse.slice().concat(dataFixing.slice());
          this.fusionTab.sort((a,b)=>b.dateNumber-a.dateNumber);
          let solde = 0;
          this.fusionTab.forEach(op => {
            if (op.type == this.TYPE_OPERATION.credit) {
              // fixing
              let amount: number = this.calculMontant(this.format2Chart(op.prix_unit), op.poids_item, this.format2Chart(op.carrat));
              solde+=amount;
              op['montant']=amount;
            }else if(op.type ==this.TYPE_OPERATION.debit){
              //caisse
              solde-=op.montant;
            }
            op['solde']=solde;
          });
          console.log("after all operations",this.fusionTab);

          // console.log(response.caisse_fournisseur);

          // 1 : Parcours du tableau de caisse
          dataCaisse.forEach((itemCaisse: any) => {
            this.TabCaisseOpts.push(itemCaisse);
            if (itemCaisse.devise == 1) {
              if (itemCaisse.operation == 3) {
                this.soldeRetourGNF += parseFloat(itemCaisse.montant)
              } else if (itemCaisse.operation == 4) {
                this.soldeDecaissementGNF += parseFloat(itemCaisse.montant)
              }
            } else if (itemCaisse.devise == 2) {
              if (itemCaisse.operation == 3) {
                this.soldeRetourUSD += parseFloat(itemCaisse.montant)
              } else if (itemCaisse.operation == 4) {
                this.soldeDecaissementUSD += parseFloat(itemCaisse.montant)
              }
            } else { }
          })

          // console.log("soldeRetourGNF => ", this.soldeRetourGNF)
          // console.log("soldeDecaisGNF => ", this.soldeDecaissementGNF)
          // console.log("soldeRetourUSD => ", this.soldeRetourUSD)
          // console.log("soldeDecaisUSD => ", this.soldeDecaissementUSD)

          // 2 : Parcours du tableau de fixing detail
          // console.log(response.fixing_detail);
          dataFixing.forEach((elem: any) => {
            let pu_ = ''
            pu_ = (elem.prix_unit).toString().substring(0, 5)
            this.TabFixingOpts.push(elem)
            // console.log(pu_);

            this.baseSoldeUSD += this.calculMontant(pu_, elem.poids_item, ((elem.carrat).toString().substring(0, 5) - elem.manquant))
            // console.log(elem);
            this.infoElem = elem;
          })
          // console.log("Decaissement : ", this.soldeDecaissementUSD);
          let soldeUSD_ = this.baseSoldeUSD + this.soldeRetourUSD // USD
          let soldeGNF_ = this.soldeRetourGNF - this.soldeDecaissementGNF // GNF
          this.SoldeGNF = soldeGNF_
          this.SoldeUSD = soldeUSD_ - this.soldeDecaissementUSD;

        }
      })
  }

  // Historique des operations
  MontantTotalFixing: number = 0
  calculMontant(pu: any, poids: any, carrat: any): any {
    let Montant = 0
    Montant = ((pu / 22) * poids * carrat)
    this.MontantTotalFixing += Montant
    return Montant
  }

  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }



}
