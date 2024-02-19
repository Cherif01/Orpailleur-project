import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CaisseDialogComponent } from './caisse-dialog/caisse-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { interval } from 'rxjs';
import { DatePipe } from '@angular/common';
import { generatePDF, imprimerDiv, imprimerDivDupliquer, refreshInFewMinute } from 'src/app/app.component';
import { DialogMessageComponent } from 'src/app/public/dialogs/dialog-message/dialog-message.component';


@Component({
  selector: 'app-caisse-principale',
  templateUrl: './caisse-principale.component.html',
  styleUrls: ['./caisse-principale.component.css']
})
export class CaissePrincipaleComponent implements OnInit {

  title = 'Caisse Principale'

  users = localStorage.getItem('username')

  // DUPLICATION
  @ViewChild('elementADupliquer', { static: false }) elementADupliquer: ElementRef | any;


  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private activeroute: ActivatedRoute,
    private dialog: MatDialog,
    private service: ApiserviceService,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  // DUPLIQUER LE RECU

  dupliquerElement() {
    const element = this.elementADupliquer?.nativeElement;
    const clone = element.cloneNode(true);
    element.parentNode.appendChild(clone);
  }
  // DUPLIQUER LE RECU

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["date"];

  idOperation: any
  ngOnInit(): void {
    this.idOperation = this.activeroute.snapshot.params['id'];
    // interval(10) // Émet une valeur toutes les 60000 millisecondes (1 minute)
    // .pipe(take(5)) // Limite le nombre total d'émissions à 5 (facultatif)
    // .subscribe(() => {
    this.getCaisse()
    this.getSoldeAll();
    // });
  }

  openDialog() {
    this.showSolde()
    this.dialog.open(CaisseDialogComponent, {
    }).afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === "insert") {
          let form: caisseData = result.data;
          switch (form.operation) {
            case 1:
            case 3:
              //console.log('1||3')
              // Entree de caisse
              this.service.LIST_ALL_PRECIS('caisse', 'solde.php')
                .subscribe(v => {
                  if (form.devise == 1) {
                    // GNF
                    form.montant_anterieur = v[0].soldeGNF + form.montant;
                  } else if (form.devise == 2) {
                    form.montant_anterieur = v[0].soldeUSD + form.montant
                  }
                  this.save(form);
                })
              break;
            case 2:
            case 4:
              //console.log('2||4')
              // Sortie de caisse
              this.service.LIST_ALL_PRECIS('caisse', 'solde.php')
                .subscribe(v => {
                  if (form.devise == 1) {
                    if (v[0].soldeGNF < form.montant) {
                      this.snackBar.open("Operation superieur au solde actif...? !", "D'accord !", {
                        duration: 3000,
                        horizontalPosition: "right",
                        verticalPosition: "top",
                        panelClass: ['bg-danger', 'text-white']
                      })
                      return
                    }
                    // GNF
                    form.montant_anterieur = v[0].soldeGNF - form.montant;
                  } else if (form.devise == 2) {
                    if (v[0].soldeUSD < form.montant) {
                      this.snackBar.open("Operation superieur au solde actif...? !", "D'accord !", {
                        duration: 3000,
                        horizontalPosition: "right",
                        verticalPosition: "top",
                        panelClass: ['bg-danger', 'text-white']
                      })
                      return
                    }
                    form.montant_anterieur = v[0].soldeUSD - form.montant
                  }
                  if (form.operation == 4 && form.fournisseur == null) {
                    this.snackBar.open("Aucun fournisseur selectionnez..? !", "D'accord !", {
                      duration: 3000,
                      horizontalPosition: "right",
                      verticalPosition: "top",
                      panelClass: ['bg-danger', 'text-white']
                    })
                  } else {
                    this.save(form);
                  }
                })
              break;
            default:
              break;
          }
        }
      })
  }

  reply(){
    this.infosLine.id = null
  }

  save(form: any) {
    let f = convertObjectInFormData(form);
    // console.log(f);
    this.service.create('caisse', 'create.php', f)
      .subscribe(v => {
        this.historique = []
        this.solde_USD = 0
        this.solde_GNF = 0
        this.getCaisse()
        this.getSoldeAll()
      })
  }


  // FACTURE CAISSE
  infosLine: any = {}
  FounisseurName: any = ''
  getInfo(id: any): void {
    this.service.getOneById('public', 'getOne.php', id, 'table_caisse')
      .subscribe({
        next: (data: any) => {
          // console.log("res : ", data);
          this.infosLine = data
          // console.log("INFO LINE ", this.infosLine);
          if (data.operation == 3 || data.operation == 4) {
            this.service.getUnique('fournisseur', 'profile.php', data.fournisseur)
              .subscribe({
                next: (f: any) => {
                  // console.log("frs", f);
                  this.FounisseurName = f.nomComplet
                }
              })
          }
        },
        error: (err: any) => console.log(err)
      })
  }



  // FUnction detectTypeOperation
  getTypeOperation(IDtype: any): any {
    switch (IDtype) {
      case 1:
      case '1':
        return "entrer de caisse";
      case 2:
      case '2':
        return "sortie de caisse";
      case 3:
      case '3':
        return "retour en caisse";
      case 4:
      case '4':
        return "décaissement";
      case 5:
      case '5':
        return "Reception client";
      case 6:
      case '6':
        return "Reglement client";
      default:
        return "-"
    }
  }

  deleteFunction(idCaisse: any) {
    // console.log('id:', this.Id_achat);
    this.dialog.open(DialogMessageComponent, {
      disableClose: true,
      data: {
        title: "Suppression demander!",
        message: "Voulez-vous vraiment supprimer cette ligne? ",
        messageNo: "Annuler",
        messageYes: "Supprimer"
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        // console.log(data);
        this.service.deleteByID('caisse', 'delete.php', idCaisse)
          .subscribe({
            next: (value) => {
              // console.log("res : ", value);
              this.historique = []
              this.getCaisse();
              this.getSoldeAll()
            },
            error: (err) => {
              console.error(err);
            }
          });
      }
    })
    //Requete suppression sur la DB
  }


  // CAISSE ELEMENT
  historique: any[] = []
  Today_h: any = new DatePipe('en_EN').transform(new Date(), 'yyyy/MM/dd');

  rechercheIntervalleForm = new FormGroup({
    dateStart: new FormControl<Date>(this.Today_h, Validators.required),
    dateEnd: new FormControl<Date | null>(null)
  })
  getCaisse(): void {
    //console.log(this.rechercheIntervalleForm.value);
    if (this.rechercheIntervalleForm.valid) {
      let values = this.rechercheIntervalleForm.value;
      this.service.LIST_SEARCH('public', 'readbyclause.php', 'table_caisse', {
        startDate: new Date(values.dateStart!).getTime(),
        endDate: values.dateEnd ?
          new Date(values.dateEnd).getTime() :
          new Date(values.dateStart!).getTime(),
      })
        .subscribe({
          next: ((data: any) => {
            // console.log("Caisse : ", data);
            this.historique = data;
          })
        })
    }
  }


  getDate_(date: Date) {
    let jour = date.getDate();
    let mois = date.getMonth() + 1; // Notez que les mois sont indexés à partir de 0
    let annee = date.getFullYear();
    return new Date(annee + '/' + mois + '/' + jour).getTime();
  }


  // VOIR LE SOLDE

  GNFAmount: number = 0
  USDAmount: number = 0
  GNFe: number = 0
  GNFs: number = 0
  USDe: number = 0
  USDs: number = 0
  Today: Date = new Date()

  viewSOLDE: any = false
  showSolde(): void {
    this.viewSOLDE = true
  }
  hideSolde(): void {
    //
    this.viewSOLDE = false
  }


  solde_GNF = 0;
  solde_USD = 0;
  getSoldeAll() {
    this.service.LIST_ALL_PRECIS('caisse', 'solde.php')
      .subscribe({
        next: (result) => {
          // console.log(result);
          this.solde_GNF = result[0].soldeGNF;
          this.solde_USD = result[0].soldeUSD;
        },
        error: (error) => {
          // console.error(error);

        }
      })
  }
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

  imprimerDiv(): void {
    const duplications = Array.from(document.querySelectorAll('.duplication'));
    imprimerDivDupliquer(duplications);
  }

  generatePDF(nameFournisseur?: string) {
    generatePDF(nameFournisseur);
  }

}
export interface caisseData {
  operation: number;
  fournisseur: number;
  representant: string;
  devise: number;
  montant: number;
  montant_anterieur: number;
  motif: string;
}

export function convertObjectInFormData(tab: any) {
  const formData = new FormData();

  for (const key in tab) {
    if (tab.hasOwnProperty(key)) {
      const value = tab[key];

      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          formData.append(key, value[i]);
        }
      } else if (typeof value === 'object' && value !== null) {
        const nestedFormData = convertObjectInFormData(value);
        nestedFormData.forEach((nestedValue, nestedKey) => {
          formData.append(key + '.' + nestedKey, nestedValue);
        });
      } else {
        formData.append(key, value);
      }
    }
  }

  return formData;
}
