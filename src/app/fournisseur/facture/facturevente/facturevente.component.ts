import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceService } from '../../vendor-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-facturevente',
  templateUrl: './facturevente.component.html',
  styleUrls: ['./facturevente.component.css']
})

export class FactureventeComponent implements OnInit {
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
    private router: Router
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  upDown = true
  title = "Facture vente (Fixing)";
  items: any[] = []
  dataAchat: any[] = []
  displaysColums = ["created_at", "slug", "fournisseur", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();


  IDFixing: any

  ngOnInit(): void {
    // ID IDFixing EN GET
    this.IDFixing = this.activeroute.snapshot.params['id'];

    this.getFixing()
  }


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
        this.id_fixing = data.id,

          // Controle du fixing dans fixing_detail
          this.serviceVendor.getAllByClause('api', 'fixing_detail', 'fixing', this.id_fixing)
            .subscribe({
              next: ((data: any) => {
                console.log(data);
              })
            })

        this.serviceVendor.getAllByClause('api', 'achat', 'id_fournisseur', data.fournisseur.id)
          .subscribe({
            next: (data) => {
              // console.log("ACHAT FOURNISSEUR")
              console.table(data)
              data.forEach((item: any) => {
                this.ListAchatThis.push(item);
              })
            },
            error: (err) => console.log(err)
          })
      },
      error: (err) => console.log(err)
    })

  }



  // Get Achat NON VALIDER
  // getAchatList(): void {
  //   this.serviceVendor.getElementById('api', 'f', 1);
  // }



  hideItem(item: any) {
    item.show = true;
    item.isHidden = true;
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
  viewDetailAchat(idAchat: any): void {
    // id_Achat : envoyer
    this.idAchat = idAchat
    // console.log(idAchat);

    this.listItems.splice(0, this.listItems.length)
    this.infoAchatView = this.ListAchatThis.find(v => v.id === idAchat);

    this.serviceVendor.getAllByClause('api', 'fixing_detail', 'id_achat', idAchat)
      .subscribe({
        next: (data) => {
          this.serviceVendor.getDetailPurchaseItems(idAchat)
            .subscribe({
              next: (items) => {
                items.forEach((elem, index) => {
                  // console.log(items),
                  this.listItems.push(items[index])
                })
              },
              error: (err) => console.log(err)
            })
        },
        error: (err) => console.log(err)
      })


    // Recuperation des items de l'achat
    // this.serviceVendor.getList('api', 'fixing_detail').subscribe({
    //   next: (data: any) => {
    //     // console.log(data);
    //     data.forEach((itemss: any) => {
    //       this.TabExist.push(itemss.achat_items.id)
    //     });
    //     this.serviceVendor.getList('api', 'achat_items')
    //       .subscribe({
    //         next: (a) => {
    //           a.forEach((itm, index) => {
    //             // console.log(a[index]);
    //             if (!this.TabExist.includes(itm.id)) {
    //               if (a[index].achat.id == this.infoAchatView.id) {
    //                 this.listItems.push(a[index]);
    //               }
    //             }
    //           })
    //         }
    //       })
    //   }
    // })
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
      console.log(form.value);

      this.serviceVendor.Add('api', 'fixing_detail', form.value)
        .subscribe({
          next: (response) => {
            this.snackBar.open("Achat par poids ajouter avec succès!", "Okay", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['bg-success', 'text-white']

            })
            this.router.navigate(['/operation/facture-fournisseur/' + this.ID_fournisseur])
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


  // ETAT D'ajout
  // one by one
  allAdd: any = false

  functionOneByOne(): void {
    this.allAdd = false
  }
  // Global Add
  functionAllAdd(): void {
    this.allAdd = true
  }

  // ADD
  PTOTAL: any = 0
  FactureFixingAdd(form: FormGroup, itemsID: any, poids: any): void {
    if (form) {
      this.PTOTAL += poids;

      if (this.allAdd == true) {
        // this.listItems.forEach(element => {
        //   // this.FactureFixing.controls.achat_items.setValue(null)
        //   this.FactureFixing.controls.achat.setValue(this.idAchat)
        //   this.FactureFixing.controls.fixing.setValue(this.id_fixing)
        //   this.FactureFixing.controls.type_envoie.setValue(2)
        // });
        console.log("GLOBAL SEND...");
        this.FactureFixing.controls.achat_items.setValue(null)
        this.FactureFixing.controls.achat.setValue(this.idAchat)
        this.FactureFixing.controls.fixing.setValue(this.id_fixing)
        this.FactureFixing.controls.type_envoie.setValue(2)
      } else if (this.allAdd == false) {
        console.log("ONE BY ONE...");
        this.FactureFixing.controls.achat.setValue(this.idAchat)
        this.FactureFixing.controls.achat_items.setValue(itemsID)
        this.FactureFixing.controls.fixing.setValue(this.id_fixing)
        this.FactureFixing.controls.type_envoie.setValue(1)
      } else { }

      this.FactureFixing.controls.fournisseur.setValue(this.ID_fournisseur)
      console.log(form.value);
      this.serviceVendor.Add('api', 'fixing_detail', form.value).subscribe({
        next: (response) => {
          this.snackBar.open("Ajout effectuer avec succes !", "Merci!", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          })
        },
        error: (err) => {
          this.snackBar.open("Error pendant l'envoie, Veuillez reessayer!", "D'accord !", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })
      // console.log(form.value);
      // this.router.navigate(['/fournisseur/facture-vente/' + this.idAchat])
    }
  }


  // LIST ACHAT
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }
}
