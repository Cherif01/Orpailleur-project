import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaisseDialogComponent } from './caisse-dialog/caisse-dialog.component';
import { EntrepriseService } from '../entreprise.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-caisse-principale',
  templateUrl: './caisse-principale.component.html',
  styleUrls: ['./caisse-principale.component.css']
})
export class CaissePrincipaleComponent implements OnInit {

  title = 'Caisse Principale'

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private activeroute: ActivatedRoute,
    private dialog: MatDialog,
    private serviceEntreprise: EntrepriseService,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["date"];

  idOperation: any
  ngOnInit(): void {
    this.idOperation = this.activeroute.snapshot.params['id'];

    this.getCaisse()
    // Un element
    // this.getInfo()
  }
  openDialog() {
    this.showSolde()
    this.dialog.open(CaisseDialogComponent, {
    }).afterClosed()
      .subscribe((result) => {
        this.hideSolde()
        // console.log(this.GNFAmount);
        // console.log(this.USDAmount);
        if (result?.event && result.event === "insert") {
          let usd_amount = ''
          let gnf_amount = ''
          usd_amount = (this.USDAmount).toString()
          gnf_amount = (this.GNFAmount).toString()
          // console.log("THIS AMOUT : ", this.USDAmount);
          // console.log("usd_amount : ", usd_amount);
          // console.log("USD CONVERTIT(usd_amount) : ", parseFloat(usd_amount));

          if (result.data.operation == 1 || result.data.operation == 3) {
            // ENTRER OU RETOUR EN CAISSE
            if (result.data.devise == 1) {
              result.data.montant_anterieur = parseFloat(gnf_amount) + result.data.montant
            } else {
              result.data.montant_anterieur = parseFloat(usd_amount) + result.data.montant
            }
          } else {
            // SORTIE OU DECAISSEMENT
            if (result.data.devise == 1) { // GNF
              result.data.montant_anterieur = parseFloat(gnf_amount) - result.data.montant
            } else { // USD
              result.data.montant_anterieur = parseFloat(usd_amount) - result.data.montant
            }
          }

          if (result.data.operation == 2 || result.data.operation == 4) {
            if (result.data.devise == 1) { // GNF
              if (result.data.montant > this.GNFAmount) {
                this.snackBar.open("Solde insuffisant, Veuillez recharger votre solde !", "Okay", {
                  duration: 4000,
                  horizontalPosition: "right",
                  verticalPosition: "top",
                  panelClass: ['bg-danger', 'text-light']
                })
              } else {
                // console.log(result.data);
                this.serviceEntreprise.Add(result.data, 'api', 'caisse')
                  .subscribe({
                    next: (data => {
                      this.snackBar.open("Operation effectuer avec success", "Okay", { duration: 3000 })
                      this.historique.push(data)
                      // this.getCaisse()
                    }),
                    error: (err) => {
                      this.snackBar.open("Erreur, pendant l'operation...", "Okay", { duration: 3000 })
                    }
                  })
              }
            } else { // USD
              if (result.data.montant > this.USDAmount) {
                this.snackBar.open("Solde insuffisant, Veuillez recharger votre solde !", "Okay", {
                  duration: 4000,
                  horizontalPosition: "right",
                  verticalPosition: "top",
                  panelClass: ['bg-danger', 'text-light']
                })
              } else {
                result.data.montant_anterieur = Number(result.data.montant_anterieur)
                // console.log("DATA SENDED... : ", result.data);
                // console.log(result.data);
                this.serviceEntreprise.Add(result.data, 'api', 'caisse')
                  .subscribe({
                    next: (data => {
                      this.snackBar.open("Operation effectuer avec success", "Okay", {
                        duration: 3000,
                        horizontalPosition: "right",
                        verticalPosition: "top",
                        panelClass: ['bg-success', 'text-light']
                      })
                      this.historique.push(data)
                      // this.getCaisse()

                    }),
                    error: (err) => {
                      console.log(err);
                      this.snackBar.open("Erreur, pendant l'operation...", "Okay", { duration: 3000 })
                    }
                  })
              }
            }

          } else {
            // console.log(result.data);
            this.serviceEntreprise.Add(result.data, 'api', 'caisse')
              .subscribe({
                next: (data => {
                  this.snackBar.open("Operation effectuer avec success", "Okay", { duration: 3000 })
                  this.historique.push(data)
                  // this.getCaisse()
                }),
                error: (err) => {
                  this.snackBar.open("Erreur, pendant l'operation...", "Okay", { duration: 3000 })
                }
              })
          }
        }
      })
  }


  // FACTURE CAISSE
  infosLine: any = {}
  FounisseurName: any = ''
  getInfo(id: number): void {
    this.serviceEntreprise.getElementById('api', 'caisse', id)
      .subscribe({
        next: (data: any) => {
          this.infosLine = data
          if(data.operation == 3 || data.operation == 4){
            this.serviceEntreprise.getElementById('api', 'fournisseur', data.fournisseur)
            .subscribe({
              next: (frs: any) => {
                this.FounisseurName = frs.prenom + ' ' + frs.nom
              }
            })
          }
        },
        error: (err: any) => console.log(err)
      })
  }

  // FUnction detectTypeOperation
  getTypeOperation(IDtype: number): any {
    switch (IDtype) {
      case 1:
        return "entrer de caisse";
      case 2:
        return "sortie de caisse";
      case 3:
        return "retour en caisse";
      case 4:
        return "décaissement";
      default:
        return "-"
    }
  }


  // CAISSE ELEMENT
  historique: any[] = []
  Today_h: Date = new Date()
  getCaisse(): void {
    this.serviceEntreprise.getList2('api', 'caisse')
      .subscribe({
        next: ((data: any) => {
          data.forEach((item: any) => {
            // console.log(item);
            let dateDB_ = new Date(item.created_at)
            if (dateDB_.getDay() == this.Today_h.getDay()) {
              this.historique.push(item)
            }
          })
        })
      })
  }


  // VOIR LE SOLDE

  GNFAmount: number = 0
  USDAmount: number = 0
  viewSOLDE: any = false
  GNFe: number = 0
  GNFs: number = 0
  USDe: number = 0
  USDs: number = 0
  Today: Date = new Date()

  showSolde(): void {
    //
    this.viewSOLDE = true
    this.GNFe = 0
    this.GNFs = 0
    this.USDe = 0
    this.USDs = 0
    this.serviceEntreprise.getList('api', 'caisse')
      .subscribe({
        next: ((data: any) => {
          data.forEach((item: any) => {
            let dateDB = new Date(item.created_at)
            if (item.operation == 1 || item.operation == 3) {
              if (item.devise == 1) {
                this.GNFe += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
              if (item.devise == 2) {
                this.USDe += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
            }
            // SORTIE
            if (item.operation == 2 || item.operation == 4) {
              if (item.devise == 1) {
                this.GNFs += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
              if (item.devise == 2) {
                this.USDs += parseFloat(item.montant)
                // if (dateDB.getDay() == this.Today.getDay()) {
                // }
              }
            }
          })
          this.GNFAmount = this.GNFe - this.GNFs
          this.USDAmount = this.USDe - this.USDs
        })
      })
    //
  }

  hideSolde(): void {
    //
    this.viewSOLDE = false
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

  imprimerDiv(): void {
    let printContents = this.divToPrint.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  generatePDF() {
    const doc = new jsPDF();
    const divElement: any = document.getElementById('recu'); // Remplacez 'divId' par l'ID de votre div

    // Utilisez la méthode html2canvas pour capturer la div sous forme d'image
    html2canvas(divElement).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');

      // Ajoutez l'image capturée au document PDF
      doc.addImage(imageData, 'PNG', 10, 10, 190, 280); // Modifiez les coordonnées et la taille selon vos besoins

      // Enregistrez le document PDF
      doc.save('_recu_caisse_.pdf');
    });
  }

}

