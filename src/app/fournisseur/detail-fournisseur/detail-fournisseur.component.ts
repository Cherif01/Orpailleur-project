import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceService } from '../vendor-service.service';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConvertMoneyComponent } from 'src/app/public/dialogs/dialog-convert-money/dialog-convert-money.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-fournisseur',
  templateUrl: './detail-fournisseur.component.html',
  styleUrls: ['./detail-fournisseur.component.css']
})
export class DetailFournisseurComponent implements OnInit {

  constructor(
    private activeroute: ActivatedRoute,
    private service_vendor: VendorServiceService,
    private service: ApiserviceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public location: Location
  ) { }

  title = "Detail du compte fournisseur"
  FournisseurGet: any = []
  ID_F: any;

  accountFournisseurGNF = this.fb.group({
    numero_compte_fournis: [0, Validators.required],
    devise: [1, Validators.required],
    fournisseur: [0, Validators.required],
    created_by: [1, Validators.required],
  })

  accountFournisseurUSD = this.fb.group({
    numero_compte_fournis: [0, Validators.required],
    devise: [2, Validators.required],
    fournisseur: [0, Validators.required],
    created_by: [1, Validators.required],
  })

  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_F = this.activeroute.snapshot.params['id'];
    this.getFournisseur()
    this.getCompteFournisseur()
    this.stockFournisseur()
    this.getInfoSolde()
  }

  // Recup fournisseur
  // GET Fournisseur
  getFournisseur() {
    this.service.getFournisseur().subscribe({
      next: (data) => {
        this.FournisseurGet = data;
      }
    })
  }

  // GET ACHAT FOURNISSEUR
  TabItems: any = []
  Poids_total_compte_fournisseur: number = 0
  Poids_total_compte_fournisseur_fixer: number = 0
  Disponible_stock: number = 0
  stockFournisseur(): void {
    this.service_vendor.getAllByClause('api', 'achat', 'fournisseur', this.ID_F)
    .subscribe({
      next: (data) => {
        data.forEach((item: any) => {
          if(item.fournisseur.id == this.ID_F) {
            this.Poids_total_compte_fournisseur += Number(item.poids_total)
          }
        })
      }
    })
  }


  // GET COMPTE Fournisseur
  TabCompteGNF: any = []
  NumberGNF: any
  cGNF: any = false
  TabCompteUSD: any = []
  NumberUSD: any
  cUSD: any = false
  getCompteFournisseur() {
    this.service_vendor.getByClause(this.ID_F).subscribe({
      next: (data) => {
        data.forEach(item => {
          if (item.fournisseur.id == this.ID_F) {
            // console.log(item);
            if (item.devise == 1) {
              this.cGNF = true
              this.TabCompteGNF.push(item)
              this.NumberGNF = item.numero_compte_fournis
            } else {
              this.cUSD = true
              this.TabCompteUSD.push(item)
              this.NumberUSD = item.numero_compte_fournis
            }
          }
        })
        // console.log(this.TabCompteGNF);
      },
      // error: (err) => console.log(err),
    })
  }

  // Req USD
  accountFournisseurFormUSD(form: FormGroup, devise: any) {
    if (form.valid) {
      //Envoyer dans la Base
      this.accountFournisseurUSD.controls.numero_compte_fournis.setValue(this.ID_F + Math.round(Math.random() * 100) + Math.round(Math.random() * 10000000));
      this.accountFournisseurUSD.controls.fournisseur.setValue(this.ID_F);
      // console.log(this.accountFournisseurUSD.value);
      let value = {
        numero_compte_fournis: this.ID_F + "" + Math.round(Math.random() * 100) + "" + Math.round(Math.random() * 10000000),
        fournisseur: this.ID_F,
        devise
      };
      this.service_vendor.addCompteUSD_FR(value).subscribe({
        next: (reponse: any) => {
          if (devise == 1) {
            // gnf
            this.NumberGNF = value.numero_compte_fournis;
            this.cGNF = true;
          } else if (devise == 2) {
            this.NumberUSD = value.numero_compte_fournis;
            this.cUSD = true;
          }
          this.snackBar.open("Compte créer avec succès !", "Okay", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          })
          // this.router.navigate(['fournisseur/list-fournisseur/']);
        },
        error: (err: any) => {
          this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
            duration: 4000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })
    }
  }


  openDialog() {
    this.dialog.open(DialogConvertMoneyComponent, {
    }).afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === "convertir") {
          // console.log(result.data);
          //Envoyer dans la Base
        }
      })
  }










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
  PoidsValider: number = 0;
  getInfoSolde(): void {
    this.service_vendor.situationMonetaire('api', 'caisse', this.ID_F)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          let dataCaisse:any = response.caisse_fournisseur
          let dataFixing:any = response.fixing_detail
          // console.log(response.caisse_fournisseur);

          // 1 : Parcours du tableau de caisse
          dataCaisse.forEach((itemCaisse: any) => {
            this.TabCaisseOpts.push(itemCaisse);
            if(itemCaisse.devise == 1){
              if(itemCaisse.operation == 3){
                this.soldeRetourGNF += Number(itemCaisse.montant)
              }else if(itemCaisse.operation == 4){
                this.soldeDecaissementGNF += Number(itemCaisse.montant)
              }
            }else if(itemCaisse.devise == 2){
              if(itemCaisse.operation == 3){
                this.soldeRetourUSD += Number(itemCaisse.montant)
              }else if(itemCaisse.operation == 4){
                this.soldeDecaissementUSD += parseFloat(itemCaisse.montant)
              }
            }else{}
          })

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
            this.PoidsValider += elem.poids_item
          })
          // console.log("Decaissement : ", this.soldeDecaissementUSD);
          console.log("POIDS : ", this.PoidsValider);

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
    Montant = ((pu/22) * poids * carrat)
    this.MontantTotalFixing += Montant
    return Montant
  }



}
