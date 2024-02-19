import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceService } from '../vendor-service.service';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogConvertMoneyComponent } from 'src/app/public/dialogs/dialog-convert-money/dialog-convert-money.component';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';
import { imprimerDiv } from 'src/app/app.component';

@Component({
  selector: 'app-detail-fournisseur',
  templateUrl: './detail-fournisseur.component.html',
  styleUrls: ['./detail-fournisseur.component.css']
})
export class DetailFournisseurComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  displaysColums = ["created_at", "Poids", "Carrat", "NFixer", "Fixing", "Discompte", "VPayer"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  TabRapportProvisoir: any[] = []

  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    public location: Location
  ) { }

  title = "Detail du compte fournisseur"
  listProvision: any[] = []
  FournisseurGet: any = {}
  ID_F: any;

  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_F = this.activeroute.snapshot.params['id'];
    this.getFournisseur()
    this.getCompteFournisseur()
    this.getProvision()
  }

  // Recup fournisseur
  // GET Fournisseur
  getFournisseur() {
    this.service.getUnique('fournisseur', 'getInfoOne.php', this.ID_F).subscribe({
      next: (data: any) => {
        // console.log("F : ", data);
        this.FournisseurGet = data;
      }
    })
  }

  // GET SITUATION FOURNISSEUR
  situationRedirect() {
    this.router.navigate(['/fournisseur/situation-monetaire/', this.ID_F])
  }

  // GET COMPTE Fournisseur
  SoldeUSD: number = 0
  SoldeGNF: number = 0
  getCompteFournisseur() {
    if (this.ID_F) {
      this.service.getUnique('fournisseur', 'operation.php', this.ID_F)
        .subscribe({
          next: (data: any) => {
            // console.log("DATA : ", data);
            // console.log("Operation : ", data);
            let u = 0
            let g = 0
            data[2].forEach((e: any) => {
              u = parseFloat(e.soldeUSD_)
              g = parseFloat(e.soldeGNF_)
            })
            let solde = 0;
            data[0].forEach((op: any) => {
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
                  this.SoldeGNF += parseFloat(op.on)
                }
              }
              op['solde'] = solde;
            })
            // console.log("FUSION : ", this.fusionTab);
            this.SoldeUSD = solde

            // SOLDE GNF
            let soldegnf = 0;
            data[1].forEach((op: any) => {
              if (op.type_operation == "debit") {
                //caisse
                if (op.devise == '1')
                soldegnf -= parseFloat(op.montant);
              } else if (op.type_operation == "Conversion") {
                //caisse
                if (op.source == '1')
                  solde -= parseFloat(op.montant);
                if (op.source == '2')
                  solde += parseFloat(op.montant);
              }
              op['solde'] = soldegnf;
            })
            // console.log("FUSION : ", this.fusionTab);
            this.SoldeGNF += soldegnf
          },
          error: (err: any) => console.log(err)
        })
    }
  }

  // Tous les achats du fournisseur
  MontantFixing = 0;
  MontantProvisoire = 0;
  getProvision() {
    this.service.getUnique('fournisseur', 'provision.php', this.ID_F)
      .subscribe({
        next: (data: any) => {
          // console.log("List Achat Provision : ", data);
          this.dataSource.data = data[0]
          data[0].forEach((elem: any) => {
            this.TabRapportProvisoir.push(elem)
            this.MontantProvisoire += parseFloat(elem.valeur_payer)
          })
          data[1].forEach((item: any) => {
            this.MontantFixing += item.MONTANT
          })
        },
        error: (err: any) => console.log(err)
      })
  }


  openDialog() {
    // console.log("GNF : ", this.SoldeGNF);
    // console.log("USD : ", this.SoldeUSD);
    this.dialog.open(DialogConvertMoneyComponent, {
    }).afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === "convertir") {
          let data = result.data
          if (data.deviseSource == 1) {
            if (data.montant <= this.SoldeGNF)
              data.destinationDevise = 2
            else {
              this.snackBar.open("Solde insuffisant!", "Okay", {
                duration: 3000,
                horizontalPosition: "center",
                verticalPosition: "bottom",
                panelClass: ['bg-danger', 'text-white']
              })
              return
            }
          } else if (data.deviseSource == 2) {
            if (data.montant <= this.SoldeUSD)
              data.destinationDevise = 1
            else {
              this.snackBar.open("Solde insuffisant!", "Okay", {
                duration: 3000,
                horizontalPosition: "center",
                verticalPosition: "bottom",
                panelClass: ['bg-danger', 'text-white']
              })
              return
            }
          } else { }
          data.idFournisseur = parseInt(this.ID_F)
          console.log(data);
          //Envoyer dans la Base
          let objetForm = convertObjectInFormData(data)
          this.service.create('caisse', 'conversion.php', objetForm)
            .subscribe({
              next: (reponse: any) => {
                console.log("Res : ", reponse);
                this.snackBar.open("Montant convertie avec succès !", "Okay", {
                  duration: 3000,
                  horizontalPosition: "center",
                  verticalPosition: "top",
                  panelClass: ['bg-success', 'text-white']
                })
                this.SoldeGNF = 0
                this.SoldeUSD = 0
                this.getCompteFournisseur()
              },
              error: (err: any) => {
                console.log("ERREUR : ", err),
                  this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
                    duration: 3000,
                    horizontalPosition: "center",
                    verticalPosition: "bottom",
                    panelClass: ['bg-danger', 'text-white']
                  })
              }
            })
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


  // Mise a jour du fixing
  saveTableData(element: any) {
    // console.log("Row : ", element);
    let table_fixing_provisoire = {
      idFournisseur: this.ID_F,
      idAchat: element.idAchat,
      poidsFixer: element.ResteAfixer,
      fixingBourse: element.Fixing,
      discompte: element.Discompte,
      valeur_payer: element.valeur_payer,
    }
    // console.log("Table : ", table_fixing_provisoire);

    const objetForm = convertObjectInFormData(table_fixing_provisoire)


    // Verification de l'existence
    this.service.LIST_BY_ID('fixing', 'get_elem.php', element.idAchat)
      .subscribe({
        next: (d) => {
          // console.log("rowCount : ", d);
          if (d != null) {
            this.service.Update('fixing', 'updateProvisoire.php', objetForm)
              .subscribe({
                next: (response) => {
                  // console.log("res : ", response);
                  this.snackBar.open("Fixing Provisoire modifier avec succès!", undefined, {
                    duration: 2000,
                    horizontalPosition: "right",
                    verticalPosition: "top",
                    panelClass: ['bg-success', 'text-white']
                  });
                },
                error: (err) => {
                  console.error("err : ", err);
                  this.snackBar.open("Echec, Veuillez reessayer!", undefined, {
                    duration: 1000,
                    horizontalPosition: "right",
                    verticalPosition: "bottom",
                    panelClass: ['bg-danger', 'text-white']
                  })
                }
              })
          } else {
            // console.log("NULL");
            this.service.create('fixing', 'addProvisoire.php', objetForm)
              .subscribe({
                next: (reponse: any) => {
                  this.snackBar.open("Enregistrer avec succès !", "Okay", {
                    duration: 3000,
                    horizontalPosition: "center",
                    verticalPosition: "top",
                    panelClass: ['bg-success', 'text-white']
                  })
                },
                error: (err: any) => {
                  console.log("ERREUR : ", err),
                    this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
                      duration: 4000,
                      horizontalPosition: "center",
                      verticalPosition: "bottom",
                      panelClass: ['bg-danger', 'text-white']
                    })
                }
              })

          }

          // Traitez les données modifiées ici
        },
        error: (err) => {
        }
      })
  }


  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }


}

