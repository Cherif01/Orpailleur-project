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

  TabCaisseOpts: any[] = []
  TabFixingOpts: any[] = []
  SoldeGNF: number = 0;
  SoldeUSD: number = 0;
  soldeRetourGNF: number = 0;
  soldeRetourUSD: number = 0;
  soldeDecaissementGNF: number = 0;
  soldeDecaissementUSD: number = 0;
  getInfoSolde(): void {
    this.serviceVendor.situationMonetaire('api', 'caisse', this.ID_F)
      .subscribe({
        next: (response: any) => {
          console.log(response);

          let dataCaisse:any = response.caisse_fournisseur
          let dataFixing:any = response.fixing_detail
          // console.log(response.caisse_fournisseur);

          // 1 : Parcours du tableau de caisse
          // dataCaisse.forEach((itemCaisse: any) => {
          //   this.TabCaisseOpts.push(itemCaisse);
          //   if(itemCaisse.devise == 1){
          //     if(itemCaisse.operation == 3){
          //       this.soldeRetourGNF += Number(itemCaisse.montant)
          //     }else if(itemCaisse.operation == 4){
          //       this.soldeDecaissementGNF += Number(itemCaisse.montant)
          //     }
          //   }else if(itemCaisse.devise == 2){
          //     if(itemCaisse.operation == 3){
          //       this.soldeRetourUSD += Number(itemCaisse.montant)
          //     }else if(itemCaisse.operation == 4){
          //       this.soldeDecaissementUSD += Number(itemCaisse.montant)
          //     }
          //   }else{}
          // })
          // this.SoldeGNF = this.soldeRetourGNF - this.soldeDecaissementGNF
          // this.SoldeUSD = this.soldeRetourUSD - this.soldeDecaissementUSD
          // 2 : Parcours du tableau de fixing detail
          // console.log(response.fixing_detail);

        }
      })
  }

  // Historique des operations




}
