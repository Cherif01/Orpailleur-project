import { ChangeDetectorRef, Component, OnInit, ViewChild, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceService } from '../../vendor-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';

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
    created_by: [1, Validators.required]
  })

  // FIXING PAR POIDS
  FixingPoids = this.fb.group({
    poids_select: [, Validators.required],
    fournisseur: [0],
    achat_items: [],
    achat: [],
    fixing: [],
    type_envoie: [0],
    created_by: [1, Validators.required]
  })

  constructor(
    private serviceVendor: VendorServiceService,
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
  title = "Gestion du fixing...";
  items: any[] = []
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums: string[] = ["select", "Poids", "Carrat", "Prix unit"];
  selection = new SelectionModel<any>(true, []);



  IDFixing: any

  ngOnInit(): void {
    // ID IDFixing EN GET
    this.IDFixing = this.activeroute.snapshot.params['id'];

    this.getFixing()

  }
  allAdd: any = false

  //#region Envoie des items dans la base de données
  EnvoieFixingDetail(selection: any) {
    console.log("Sending, please wait ... : ", selection);
    // if()
    this.serviceVendor.Add('api', 'fixing_detail/1/create_fixing_detail', selection).subscribe({
      next: (response) => {
        // console.log("RESPONSE : ", response);
        this.snackBar.open("Ajout effectuer avec succes !", "Merci!", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ['bg-success', 'text-white']
        })
        this.hideSelectedItem(selection);
        // window.location.reload()
      },
      error: (err) => {
        this.snackBar.open("Erreur pendant l'envoie, Veuillez reessayer!", "D'accord !", {
          duration: 3000,
          horizontalPosition: "right",
          verticalPosition: "bottom",
          panelClass: ['bg-danger', 'text-white']
        })
      }
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
    let tab = this.listItems.filter(v => !(items.find(item => item.achat_items === v.id)));
    this.listItems = tab.slice();
    this.dataSource.data = tab.slice();
    this.dataSource.paginator = this.paginator;
    this.selection.selected.forEach(v => {
      this.infoAchatView.poids_total -= v.poids_achat;
    })
    this.selection.clear(true);
    this.cdr.markForCheck();
    this.cdr.detectChanges();
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
  poidsAttribuer: number = 0
  statut_fixing: number = 0
  FixingEncours: any
  // GET
  getFixing(): void {
    this.serviceVendor.getElementById('api', 'fixing', this.IDFixing).subscribe({
      next: (data) => {
        // console.log(data.fournisseur.id);
        this.Name_fournisseur = data.fournisseur.prenom + ' ' + data.fournisseur.nom
        this.Adresse_fournisseur = data.fournisseur.ville + ' / ' + data.fournisseur.telephone
        this.ID_fournisseur = data.fournisseur.id
        this.poids_fixer = data.poids_fixe
        this.fixing_bourse = data.fixing_bourse
        this.discount = data.discompte
        this.id_fixing = data.id
        this.statut_fixing = data.status
        // console.log('STATUT : ' + data.status);
        // Controle du fixing dans fixing_detail
        this.serviceVendor.infoFixing('api', 'fixing_detail', this.id_fixing)
          .subscribe({
            next: ((data: any) => {
              // console.log(data);
              this.poidsAttribuer = data.poids_total_fixing_dans_fixing_detail
              // console.log(this.poidsAttribuer);
            })
          })

        this.serviceVendor.getAllByClause('api', 'achat', 'id_fournisseur', data.fournisseur.id)
          .subscribe({
            next: (data) => {
              // console.log("ACHAT FOURNISSEUR")
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


  logSelected() {
    let selected = this.selection.selected;
    let tab: any[] = [];
    selected.forEach(v => {
      tab.push({
        achat_items: v.id,
        achat: v.achat.id,
        fournisseur: v.achat.fournisseur.id,
        fixing: this.id_fixing,
        type_envoie: 1,
        created_by: 1,
      });
    });
    this.EnvoieFixingDetail(tab)
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

  PVendu: number = 0
  PT_Restant: number = 0
  type_envoie: number = 0
  viewDetailAchat(idAchat: any): void {
    // id_Achat : envoyer
    this.idAchat = idAchat
    // console.log(idAchat);
    this.listItems.splice(0, this.listItems.length)
    this.infoAchatView = this.ListAchatThis.find(v => v.id === idAchat);

    this.serviceVendor.getAllByClause('api', 'fixing_detail', 'id_achat', idAchat)
      .subscribe({
        next: (data) => {
          this.serviceVendor.getDetailPurchaseItems('api', 'achat_items', idAchat)
            .subscribe({
              next: (items: any = {}) => {
                console.log(items);
                this.type_envoie = items.type_envoie;
                if (this.type_envoie == 3) {
                  this.PVendu = Number(items.somme_poids)
                  this.PT_Restant = Number(this.infoAchatView.poids_total) - Number(items.somme_poids)
                }
                items.data.forEach((elem: any) => {
                  this.PT_Restant += Number(elem.poids_achat);
                });
                this.listItems = items.data;
                this.dataSource.data = items.data;
                this.dataSource.paginator = this.paginator;
              },
              error: (err) => console.log(err)
            })
        },
        error: (err) => console.log(err)
      })
  }

  // UPDATE FIXE POIDS
  UFix(form: FormGroup): void {
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


  // Cloture FIX
  ClotureFix(form: FormGroup): void {
    if (form.valid) {
      this.confirmFixing.controls.id.setValue(this.id_fixing)
      this.confirmFixing.controls.discompte.setValue(this.discount)
      this.confirmFixing.controls.fixing_bourse.setValue(this.fixing_bourse)
      this.confirmFixing.controls.poids_fixe.setValue(this.poids_fixer)
      // console.log(form.value);
      this.serviceVendor.mettreAJourRessource(form.value)
        .subscribe({
          next: (response) => {
            this.snackBar.open("FIXING CLOTURER, avec succès!", "Okay", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "top",
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
  PFix(form: FormGroup, idAchat: number): void {
    if (form.valid) {
      this.infoAchatView = this.ListAchatThis.find(v => v.id === idAchat);
      console.log("Envoie par poids saisi...");
      form.value.achat = this.infoAchatView.id
      form.value.fixing = this.id_fixing
      form.value.fournisseur = this.infoAchatView.fournisseur.id
      form.value.type_envoie = 3
      this.FactureFixing.controls.poids_select.setValue(form.value.poids_select)
      // console.log(form.value);

      this.serviceVendor.Add('api', 'fixing_detail', form.value)
        .subscribe({
          next: (response) => {
            console.log(response);
            this.snackBar.open("Achat par poids ajouter avec succès!", "Okay", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['bg-success', 'text-white']

            })
            // this.router.navigate(['/fournisseur/facture-vente/' + this.ID_fournisseur])
            window.location.reload()
            form.reset()
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


  // LIST ACHAT
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }
}
