import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { FormControl } from '@angular/forms'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { Observable} from 'rxjs'
import { imprimerDiv } from 'src/app/app.component'

@Component({
  selector: 'app-rapportjour',
  templateUrl: './rapportjour.component.html',
  styleUrls: ['./rapportjour.component.css']
})
export class RapportjourComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;


  TYPE_OPERATION = {
    credit: 1,
    debit: 2
  }

  constructor (private service: ApiserviceService, public location: Location) {
  }

  // Control
  myControl = new FormControl('')
  options!: any[]
  Finaldata!: Observable<any[]>

  title = 'Rapport du jour...'

  ngOnInit (): void {
    this.detailsFournisseur()
  }

  // GET COMPTE Fournisseur
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
  dataAchat: any[] = []
  detailsFournisseur () {
    this.service
      .getList('fournisseur', 'rapportjour.php')
      .subscribe({
        next: (data: any) => {
          console.log("DATA : ", data);
          let u = 0
          let g = 0
          data[2].forEach((e: any) => {
            u = parseFloat(e.soldeUSD_)
            g = parseFloat(e.soldeGNF_)
          })

          let solde = 0
          data[0].forEach((op: any) => {
            // console.log("Echo USD : ", op)
            if (op.type_operation == 'credit') {
              // fixing
              solde += parseFloat(op.montant)
              // op['solde'] = amount;
            } else if (op.type_operation == 'debit') {
              //caisse
              if (op.devise == '2') solde -= parseFloat(op.montant)
            } else if (op.type_operation == 'Conversion') {
              //caisse
              if (op.source == '2') {
                solde += parseFloat(op.montant)
                this.SoldeGNF += parseFloat(op.on)
              }
            }
            op['solde'] = solde
          })
          // console.log("FUSION : ", this.fusionTab);
          this.SoldeUSD = solde

          // SOLDE GNF
          let soldegnf = 0
          data[1].forEach((op: any) => {
            if (op.type_operation == 'debit') {
              //caisse
              if (op.devise == '1') soldegnf -= parseFloat(op.montant)
            } else if (op.type_operation == 'Conversion') {
              //caisse
              if (op.source == '1') solde -= parseFloat(op.montant)
              if (op.source == '2') solde += parseFloat(op.montant)
            }
            op['solde'] = soldegnf
          })
          // console.log("FUSION : ", this.fusionTab);
          this.SoldeGNF += soldegnf

          this.fusionTab = data[0]
          this.dataAchat = data[3]
        },
        error: (err: any) => console.log(err)
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

   imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }

}
