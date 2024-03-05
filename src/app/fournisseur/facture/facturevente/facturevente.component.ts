import { ChangeDetectorRef, Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceService } from '../../vendor-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

@Component({
  selector: 'app-facturevente',
  templateUrl: './facturevente.component.html',
  styleUrls: ['./facturevente.component.css'],
  // changeDetection:ChangeDetectionStrategy.OnPush
})

export class FactureventeComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  FactureFixing = this.fb.group({
    fournisseur: [0],
    achat_items: [],
    achat: [],
    poids_select: [],
    fixing: [],
    type_envoie: [0],
    carrat_moyen_restant: [0],
    // checked: [false],
    created_by: [1, Validators.required]
  })



  // MISE A JOUR FIxiNG
  UpdateFixing = this.fb.group({
    id: new FormControl(0),
    discompte: new FormControl(0),
    fixing_bourse: new FormControl(0),
    poids_fixe: [, Validators.required],
    created_by: [1, Validators.required]
  })

  // CLOTURE DU FIxiNG
  confirmFixing = this.fb.group({
    id: new FormControl(0),
    discompte: new FormControl(0),
    poids_fixe: [0, Validators.required],
    fixing_bourse: new FormControl(0),
    status: [2, Validators.required],
    created_by: [7, Validators.required]
  })

  // FIXING PAR POIDS
  FixingPoids = this.fb.group({
    poids_select: [, Validators.required],
    fournisseur: [0],
    achat_items: [],
    achat: [],
    fixing: [],
    type_envoie: [0],
    carrat_moyen_restant: [0],
    carrat_manquant: [],
    created_by: [7, Validators.required]
  })

  constructor(
    private serviceVendor: VendorServiceService,
    private service: ApiserviceService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    public location: Location,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  upDown = true
  title = "Vente du fixing";
  items: any[] = []
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums: string[] = ["select", "Poids", "Carrat", "Manquant", "Prix unit"];
  selection = new SelectionModel<any>(true, []);

  // idSession: string = localStorage.getItem('id');

  IDFixing: any

  ngOnInit(): void {
    // ID IDFixing EN GET
    this.IDFixing = this.activeroute.snapshot.params['id'];
    this.getFixing()
  }
  allAdd: any = false

  //#region Envoie des items dans la base de données
  poidsEnvoie: number = 0
  EnvoieFixingDetail(tabFixingValidInitAndItemsSelect: any) {
    // console.log("Select : ", tabFixingValidInitAndItemsSelect);

    tabFixingValidInitAndItemsSelect[1].forEach((insert: any) => {
      const formData = new FormData()
      formData.append('idAchat', tabFixingValidInitAndItemsSelect[0][0].idAchat)
      formData.append('idFournisseur', tabFixingValidInitAndItemsSelect[0][0].idFournisseur)
      formData.append('idFixing', tabFixingValidInitAndItemsSelect[0][0].idFixing)
      formData.append('codeGenerate', tabFixingValidInitAndItemsSelect[0][0].codeGenerate)
      formData.append('idItem', insert.idItem)

      const updateFormData = new FormData()
      updateFormData.append('id', insert.idItem)
      updateFormData.append('etatFixinFrs', "1")

      console.log(this.format2Chart(this.poids_fixer));
      console.log(this.format2Chart(this.PVendu));

      this.service.create('fixing', 'addTableDetail.php', formData).subscribe({
        next: (response: any) => {
          // console.log("RES : ", response);
          // Update
          this.service.Update('fixing', 'updateItem.php', updateFormData)
            .subscribe({
              next: (responseUpdate) => {
                // console.log("responseUpdate : ", responseUpdate);
                // console.log("ITEM AJOUTER ", tabFixingValidInitAndItemsSelect);
                this.hideSelectedItem(tabFixingValidInitAndItemsSelect[1])

                // SI POIDS OK


                if (this.format2Chart(this.poids_fixer) == this.format2Chart(this.PVendu)) {
                  // console.log("cloture en cours...");
                  const updateFormData2 = new FormData()
                  updateFormData2.append('id', tabFixingValidInitAndItemsSelect[0][0].idFixing)
                  updateFormData2.append('statut_fixing', "2")
                  // Update
                  this.service.Update('fixing', 'clotureFixing.php', updateFormData2)
                    .subscribe({
                      next: (responseUpdate) => {
                        console.log("Fixing cloturer et redirection en cours... : ", responseUpdate);
                        this.router.navigate(['/operation/facture-fournisseur/' + this.ID_fournisseur])
                      },
                      error: (err) => {
                        console.log("errUpdate : ", err);
                      }
                    })
                } else {
                  console.log("Fixing non cloturer");
                }
                // SI POIDS OK
              },
              error: (err) => {
                console.log("errUpdate : ", err);
              }
            })
          this.snackBar.open("Operation reussi... !", "Merci!", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          })
        },
        error: (err: any) => {
          console.log("ERR : ", err);
          this.snackBar.open("Erreur pendant la validation !", "D'accord!", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })


    })
  }
  //#endregion

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  hideSelectedItem(items: any[]) {
    let tab = this.listItems.filter(v => !(items.find(item => item.idItem === v.id)));
    this.listItems = tab.slice();
    this.dataSource.data = tab.slice();
    this.dataSource.paginator = this.paginator;
    this.selection.selected.forEach(v => {
      this.infoAchatView.poidsTotal -= v.poidsItem;
    })
    this.selection.clear(true);
    this.cdr.markForCheck();
    this.cdr.detectChanges();
    this.router.navigate(['/operation/facture-fournisseur/' + this.ID_fournisseur])
    // window.location.reload()
  }


  // INFOS FOURNISSEUR
  ID_fournisseur: number = 0
  Name_fournisseur: any = ''
  Adresse_fournisseur: any = ''
  poids_fixer: any
  fixing_bourse: any
  discount: any
  id_fixing: any
  ListAchatThis: any[] = []

  sommeItemsInFixingDetails: number = 0
  poidsAttribuer: any = 0
  statut_fixing: number = 0
  FixingEncours: any
  // GET
  getFixing(): void {
    this.service.getUnique('fixing', 'getOne.php', this.IDFixing)
      .subscribe({
        next: (data) => {
          // console.log("Data Resp : ", data);
          this.Name_fournisseur = data[0][0].Name_fournisseur
          this.Adresse_fournisseur = data[0][0].Adresse_fournisseur
          this.ID_fournisseur = data[0][0].ID_fournisseur
          this.poids_fixer = data[0][0].poids_fixer
          this.fixing_bourse = data[0][0].fixing_bourse
          this.discount = data[0][0].discount
          this.id_fixing = data[0][0].id_fixing
          this.statut_fixing = data[0][0].statut_fixing
          // Poids vendu concernant ce fixing
          this.poidsAttribuer += data[2];

          this.service.getUnique('fixing', 'listAchat.php', this.ID_fournisseur)
            .subscribe({
              next: (data) => {
                // console.log("List Achat : ", data);
                data.forEach((item: any) => {
                  this.ListAchatThis.push(item)
                })
              },
              error: (err) => console.log(err)
            })
        },
        error: (err) => console.log(err)
      })
  }

  // Envoie dans la db
  logSelected() {
    let selected = this.selection.selected;
    // let idItem: any = ""
    // console.log("this.PVendu : ", this.PVendu);
    // Variable
    let idAchat: number = 0
    let poidsT: number = 0
    let codeGenerate: any = Math.floor(Math.random() * (1000000 - 1000 + 1)) + 2023;
    let TabDonnees: any[] = []
    let TabItems: any[] = []

    selected.forEach(v => {
      // Poids total des items selectionner
      // console.log(v);
      idAchat = v.idAchat;
      poidsT += parseFloat(v.poidsItem);
      this.PVendu += parseFloat(v.poidsItem);
      TabItems.push({
        idItem: v['idItem']
      })
    });
    TabDonnees = [{
      poidsT: poidsT,
      idAchat: idAchat,
      idFournisseur: this.ID_fournisseur,
      idFixing: this.IDFixing,
      codeGenerate: codeGenerate,
    }]

    // GEstion
    let idItems: any[] = []
    TabItems.forEach((data) => {
      idItems.push(data)
      // console.log("ID_ITEM : ", data);
    })

    // console.log("poidsT1 : ", poidsT);
    // console.log("poidsT2 : ", (this.poids_fixer -  parseFloat(this.poidsAttribuer)));

    let TabData: any[] = []
    TabData.push(TabDonnees, idItems)

    // Poids selectionner <= Reste
    if (this.format2Chart(poidsT) <= this.format2Chart(this.poids_fixer - this.poidsAttribuer)) {
      this.EnvoieFixingDetail(TabData)
    } else {
      this.snackBar.open("Poids depasser (verifier svp...) !", "D'accord !", {
        duration: 3000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
        panelClass: ['bg-danger', 'text-white']
      })
      // setTimeout(() => {
      //   window.location.reload()
      // }, 1000)
    }

  }


  // Details
  listItems: any[] = []
  fixing_detailItem: any = []
  fournisseurAdd: any
  idAchat: any
  detailFixing: any = false

  TabExist: any = []
  myArray: any = []
  infoAchatView: any = {}

  typeSendPoids: boolean = false
  PVendu: any = 0
  PT_Restant: number = 0
  carrat_moyen: number = 0
  type_envoie: number = 0
  cMoyenActif: any = 0
  manquant: any = 0
  viewDetailAchat(idAchat: any): void {
    // id_Achat : envoyer
    this.idAchat = idAchat
    // this.listItems.splice(0, this.listItems.length)
    this.infoAchatView = this.ListAchatThis.find(v => v.id_achat === idAchat);
    // console.log("IDA",idAchat);
    this.service.getUnique('fixing', 'getItemFalse.php', idAchat)
      .subscribe({
        next: ((items: any) => {
          // console.log("Data Achat... : ", items);
          this.dataSource.data = items[0];
          this.dataSource.paginator = this.paginator;
          // console.log("datasurce : ", this.dataSource.data);
          this.PVendu += items[1]
          this.typeSendPoids = items[2]
          // console.log(this.typeSendPoids);
          items[0].forEach((cm: any) => {
            // console.table(cm)
            this.manquant += cm.manquantItem
            this.carrat_moyen += ((cm.carratItem + cm.manquantItem) * cm.poidsItem);
            this.PT_Restant += cm.poidsItem;
            // console.log("C : ", cm.carratItem);
            // console.log("M : ", cm.manquantItem);
            // console.log("Res+ : ", ((cm.cjarratItem + cm.manquantItem)* cm.poidsItem));
          });
          console.log("Manquant : ", this.manquant);
          this.listItems = items[0];
          this.cMoyenActif = this.format2Chart((this.carrat_moyen / this.PT_Restant))
          console.log("C-Actif: ", this.cMoyenActif);
        }),
        error: (err) => console.log("ERROR : ", err)
      })
  }

  // UPDATE FIXE POIDS
  UFixing(form: FormGroup): void {
    if (form.valid) {
      this.UpdateFixing.controls.id.setValue(this.id_fixing)
      this.UpdateFixing.controls.discompte.setValue(this.discount)
      this.UpdateFixing.controls.fixing_bourse.setValue(this.fixing_bourse)
      // console.log(form.value);
      this.serviceVendor.mettreAJourRessource(form.value)
        .subscribe({
          next: (response) => {
            this.snackBar.open("Fixing MAJ avec succès!", "Okay", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['bg-success', 'text-white']

            })
            this.router.navigate(['/operation/facture-fournisseur/' + this.ID_fournisseur])
          },
          error: (err) => {
            this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['bg-danger', 'text-white']
            })
          }
        })

    }
  }

  // ADD FIXING FOR POIDS
  PFix(form: FormGroup, idAchat: any, cmr: any): void {
    if (form.valid) {
      this.infoAchatView = this.ListAchatThis.find(v => v.id_achat === idAchat);
      // (this.poids_fixer - this.poidsAttribuer) // reste
      if ((this.poids_fixer - this.poidsAttribuer) >= form.value.poids_select) {
        const formData = new FormData()
        formData.append('idAchat', this.idAchat)
        formData.append('idFournisseur', this.ID_fournisseur.toString())
        formData.append('idFixing', this.id_fixing)
        formData.append('poids', form.value.poids_select)
        formData.append('carrat', this.cMoyenActif)
        formData.append('carrat_manquant', this.manquant)

        this.service.create('fixing', 'addTablePoids.php', formData).subscribe({
          next: (response: any) => {
            // console.log("RES : ", response);
            this.snackBar.open("Ajout effectuer avec succes !", "Merci!", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['bg-success', 'text-white']
            })
            if ((this.poids_fixer) == this.poidsAttribuer + form.value.poids_select) {
              // console.log("cloture en cours...");
              const updateFormData = new FormData()
              updateFormData.append('id', this.IDFixing)
              updateFormData.append('statut_fixing', "2")

              this.service.create('fixing', 'addTableDetail.php', formData).subscribe({
                next: (response: any) => {
                  // console.log("RES : ", response);
                  // Update
                  this.service.Update('fixing', 'clotureFixing.php', updateFormData)
                    .subscribe({
                      next: (responseUpdate) => {
                        // console.log("responseUpdate : ", responseUpdate);
                        this.router.navigate(['/operation/facture-fournisseur/' + this.ID_fournisseur])
                      },
                      error: (err) => {
                        console.log("errUpdate : ", err);
                      }
                    })
                },
                error: (err: any) => {
                  console.log("ERR : ", err);
                }
              })
            }
            this.router.navigate(['/operation/facture-fournisseur/' + this.ID_fournisseur])
          },
          error: (err: any) => {
            console.log("ERR : ", err);
            this.snackBar.open("Erreur pendant la validation !", "D'accord!", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['bg-danger', 'text-white']
            })
          }
        })

      } else {
        this.snackBar.open("Poids superieur au reste a valider !", "D'accord !", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ['bg-danger', 'text-white']
        })
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    }
  }


  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }


  // LIST
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }
}
