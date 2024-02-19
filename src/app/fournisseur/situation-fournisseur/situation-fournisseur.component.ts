import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VendorServiceService } from '../vendor-service.service';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

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
    public location: Location,
    private service: ApiserviceService
  ) { }

  ID_F: any
  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_F = this.activeroute.snapshot.params['id'];
    this.getOneFournisseur()
    this.getSituation()
  }


  objetFRS: any
  // ONE FOURNISSEUR
  getOneFournisseur(): void {
    // this.objetFRS = {}
    if (this.ID_F) {
      this.service.getOneById('public', 'getOne.php', this.ID_F, 'table_fournisseur').subscribe({
        next: (data: any) => {
          // console.log(data),
          this.objetFRS = data
        },
        error: (err: any) => console.log(err)
      })
    }
  }
  fusionTab: any[] = [];
  fusionTab2: any[] = [];
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

  getSituation(): void {
    if (this.ID_F) {
      this.service.getUnique('fournisseur', 'operation.php', this.ID_F)
        .subscribe({
          next: (data: any) => {
            // console.log("Operation : ", data);
            let u = 0
            let g = 0
            data[2].forEach((e: any) => {
              u = e.soldeUSD_
              g = e.soldeGNF_
            })
            // console.log(data[2]);
            // FIN....
            this.fusionTab = data[0]
            let solde = 0;
            this.fusionTab.forEach((op: any) => {
              // console.log("Echo USD : ", op)
              if (op.type_operation == "credit") {
                // fixing
                solde += parseFloat(op.montant);
                // op['solde'] = amount;
              } else if (op.type_operation == "debit") {
                //caisse
                if (op.devise == '2')
                  solde -= parseFloat(op.montant);
              } else if (op.type_operation == "Conversion") {
                //caisse
                if (op.source == '2') {
                  solde += parseFloat(op.montant);
                  this.SoldeGNF += op.on
                }
                if (op.source == '1') {
                  solde -= parseFloat(op.montant);
                  this.SoldeGNF += op.on
                }

              }
              op['solde'] = solde;
            })
            // console.log("FUSION : ", this.fusionTab);
            this.SoldeUSD = solde
            // GNF
            this.fusionTab2 = data[1]
            let solde_gnf = 0;
            this.fusionTab2.forEach((op: any) => {
              // console.log("Echo  GNF : ", op)
              if (op.type_operation == "debit") {
                //caisse
                if (op.devise == '1')
                  solde_gnf -= parseFloat(op.montant);
              } else if (op.type_operation == "Conversion") {
                //caisse
                if (op.source == '1')
                  solde -= parseFloat(op.montant);
                if (op.source == '2')
                  solde += parseFloat(op.montant);
              }
              op['solde'] = solde_gnf;
            })
            // console.log("FUSION : ", this.fusionTab);
            this.SoldeGNF += solde_gnf

            // SEND MESSAGE
            // this.service.GetAllByName('public', 'sendmessage.php', this.SoldeUSD)
            //   .subscribe({
            //     next: (data: any) => {
            //       console.log("DATA : ", data);
            //     }
            //   })

          },
          error: (err: any) => console.log(err)
        })
    }
  }

  // Historique des operations
  MontantTotalFixing: number = 0
  calculMontant(pu: any, poids: any, carrat: any): any {
    let Montant = 0
    Montant = ((pu / 22) * poids * carrat)
    this.MontantTotalFixing += Montant
    return Montant
  }


  numberVal(numbers: any): any {
    switch (numbers) {
      case '1':
        return 'GNF';
        break;
      case '2':
        return 'USD';
        break;
      default:
        break;
    }
  }

  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }



}
