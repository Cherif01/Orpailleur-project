import { Component, OnInit, Inject, Optional, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { PurchaseService } from '../purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogMessageComponent } from 'src/app/public/dialogs/dialog-message/dialog-message.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})
export class AddPurchaseComponent implements OnInit {
  DENSITE = 22;
  slug = ""
  dataSource: any[] = [];
  dataItems: any[] = []
  dataItemsList: any[] = []

  Achat = this.fb.group({
    poids_achat: [, [Validators.required, Validators.min(0)]],
    carrat_achat: [, [Validators.required, Validators.min(10), Validators.max(24)]],
    manquant: [0, [Validators.required, Validators.min(0)]],
    achat: [0],
    created_by: [1, [Validators.required]]
  })

  validerAchatForm = new FormGroup({
    id: new FormControl(0),
    // fournisseur: new FormControl(0),
    poids_total: new FormControl(0),
    carrat_moyen: new FormControl(0),
    // created_by: new FormControl(1),
    status: new FormControl(2)
  });



  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private purchaseService: PurchaseService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    public location: Location
  ) {
    // this.slug = new Date().getTime()+""+ Math.round(Math.random()* 100000000)
    // this.slug = Math.round(Math.random() * 100000000).toString();
  }

  title = 'Add Purchase';
  FournisseurGet: any
  ID: any = 0
  dataAchat: any
  LastAchat: any = false
  Id_achat: any
  slugSession: any
  status_achat: any


  ngOnInit(): void {
    // ID_FOURNISSEUR EN GET
    this.ID = this.activeroute.snapshot.params['id'];

    // // List achat items
    this.Actualiser();
    // Get
    this.getAchatList();
    this.getLot();
  }

  getAchatList(): void {
    this.service.getList('api', 'achat').subscribe((result: any[]) => {
      this.dataAchat = result;
      // console.log(result);
      // Loop over the data array and log each item
      this.dataAchat.forEach((item: any) => {
        if (item['status'] == 1 && item.fournisseur.id == this.ID) {
          // if (item['created_by'] == 1) {
          this.LastAchat = true;
          this.Id_achat = item.id
          this.slugSession = item.slug
          this.status_achat = item.status

          // console.log(this.slugSession);
        } else if (item.status == 2 && item.slug == this.slugSession) {
          this.router.navigate(['operation/list-purchase'])
        } else { }
      });
    });

  }

  //
  PTotal_this: any = 0;
  CAR_Total_this: any = 0;
  getItems(): any {
    this.purchaseService.getPurchaseOnline(this.ID)
      .subscribe({
        next: (dataItems => {
          if (dataItems.length > 0) {
            this.dataItemsList.splice(0, this.dataItemsList.length)
            this.PTotal_this = 0
            this.CAR_Total_this = 0
            // console.log(dataItems);
            dataItems.forEach((item) => {
              this.PTotal_this += item.poids_achat
              this.CAR_Total_this += item.poids_achat * item.carrat_achat
            })
            this.dataItemsList = dataItems
            // this.snackBar.open("Nouvelle barre ajouter !", "Okey")
          } else {
            // this.snackBar.open("Aucune barres enregistrer au paravant vide !", "Okey")
          }
        }),
        error: (error => {
          console.log(error);
        })
      })
  }

  Actualiser(): void {
    // List achat items
    this.getItems();
  }

  // Recuper le dernier achat

  // Req
  AchatAddItemsForm(form: FormGroup) {
    if (form.valid) {
      this.dataSource.push(this.Achat.value);
      this.Achat.controls.achat.setValue(this.Id_achat)
      //Envoyer dans la Base
      this.dataItemsList = []
      this.purchaseService.achatAddItemsPost(form.value).subscribe({
        next: (response: any) => {
          // console.log(response);
          console.log("Ligne placee avec success... ")
          this.resetForm(form, ["poids_achat", "carrat_achat", "manquant"]);
          this.Actualiser()
        },
        error: (err: any) => console.log(err)
      })
    } else {
      console.log("Formulaire invalid")
    }
  }

  resetForm(form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      form.controls[field].setValue(null);
      form.controls[field].updateValueAndValidity();
    })
  }

  // GET Arrivage
  listLot: any
  getLot() {
    this.purchaseService.getList('api', 'arrivage').subscribe({
      next: (data) => {
        const todayDate = new Date().toLocaleDateString();
        // console.log(todayDate);
        data.forEach((item: any) => {
          const dbDate = new Date(item.created_at).toLocaleDateString();
          // console.log(dbDate);
          if (todayDate === dbDate) {
            // console.log("Egale");
            this.listLot = item
          }
        })
      }
    })
  }

  // update Achat
  sendForm = new FormGroup({
    arrivage: new FormControl(0),
    achat: new FormControl(0)
  })

  updateAchat(form: FormGroup): void {
    if (form.valid) {
      // console.log(this.Id_achat);
      this.validerAchatForm.controls.id.setValue(this.Id_achat)
      this.validerAchatForm.controls.poids_total.setValue(this.PTotal_this)
      this.validerAchatForm.controls.carrat_moyen.setValue((this.CAR_Total_this / this.PTotal_this))
      // this.validerAchatForm.controls.fournisseur.setValue(this.ID)
      // console.log(form.value);
      this.purchaseService.mettreAJourRessource(form.value)
        .subscribe({
          next: (response) => {
            // this.snackBar.open("Cet achat est maintenant valider avec succès!", "Okay", {
            //   duration: 3000,
            //   horizontalPosition: "right",
            //   verticalPosition: "top",
            //   panelClass: ['bg-success', 'text-white']

            // })
            // AJout dans le lot ouvert
            this.sendForm.controls.arrivage.setValue(this.listLot.id);
            this.sendForm.controls.achat.setValue(this.Id_achat);
            // console.log(this.sendForm);
            this.purchaseService.PostElement('api', 'attribution', this.sendForm.value).subscribe({
              next: (response) => {
                this.snackBar.open("Cet achat est maintenant dans le lot : " + this.listLot.designation + " !", "Okay", {
                  duration: 4000,
                  horizontalPosition: "center",
                  verticalPosition: "top",
                  panelClass: ['bg-success', 'text-white']
                })
              },
              error: (err) => {
                this.snackBar.open("Echec lors de l'attribution : (Clicker sur un achat...), Veuillez reessayer!", "Okay", {
                  duration: 3000,
                  horizontalPosition: "right",
                  verticalPosition: "bottom",
                  panelClass: ['bg-danger', 'text-white']
                })
              }
            })

            this.router.navigate(['/operation/facturepurchase/' + this.Id_achat])
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

  // GET Fournisseur
  getOneFournisseurAchat() {
    this.service.getFournisseur().subscribe({
      next: (data) => {
        this.FournisseurGet = data;
      }
    })
  }

  // Materiale dataSource
  // save() {
  //   console.log(this.dataSource);
  // }

  deleteItems(id: any) {
    let tab: any[] = [];
    this.dialog.open(DialogMessageComponent, {
      disableClose: true,
      data: {
        title: "Suppression d'une barre",
        message: "Voulez-vous vraiment supprimer cette barre? ",
        messageNo: "Annuler",
        messageYes: "Supprimer"
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        this.purchaseService.deleteItems(id)
          .subscribe({
            next: (value) => {
              this.dataItemsList.map((value, index) => {
                if (value.id !== id) {
                  tab.push(value)
                }
                this.Actualiser()
              });
              this.dataItemsList = tab;
            },
            error: (err) => {
              console.error(err);
            }
          });
      }
    })
    //Requete suppression sur la DB
  }

  openDialog() {
    this.dialog.open(dialogAddPurchase, {
      // disableClose:true,
    })
  }

}
@Component({
  template: `
    <mat-dialog-content>
      Limanaya Business
    </mat-dialog-content>
  `,
})
export class dialogAddPurchase implements OnInit {
  ngOnInit(): void {
    console.log(this.data);
  }

  constructor(
    public dialogRef: MatDialogRef<dialogAddPurchase>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

  }

  closeDialog() {
    this.dialogRef.close();
  }

}
