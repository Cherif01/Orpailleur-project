import { Component, OnInit, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { PurchaseService } from '../purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { DialogMessageComponent } from 'src/app/public/dialogs/dialog-message/dialog-message.component';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';

@Component({
  selector: 'app-add-purchase',
  templateUrl: './add-purchase.component.html',
  styleUrls: ['./add-purchase.component.css']
})


export class AddPurchaseComponent implements OnInit {
  DENSITE = 22;
  slug = ""
  achat: any
  dataSource: any[] = [];
  dataItems: any[] = []
  dataItemsList: any[] = []

  // Achat = this.fb.group({
  //   poidsItem: [, [Validators.required, Validators.min(0)]],
  //   carratItem: [, [Validators.required, Validators.min(10), Validators.max(24)]],
  //   manquantItem: [0, [Validators.required, Validators.min(0)]],
  //   idAchat: [0],
  //   created_by: [1]
  // })

  Achat = new FormGroup({
    poidsItem: new FormControl('', [Validators.required, Validators.min(0)]),
    carratItem: new FormControl('', [Validators.required, Validators.min(0)]),
    manquantItem: new FormControl(0, [Validators.required]),
    idAchat: new FormControl(0),
    etatFixinFrs: new FormControl(0),
    etatFixinExp: new FormControl(0),
    created_by: new FormControl(1),
  })

  validerAchatForm = new FormGroup({
    id: new FormControl(0),
    poidsTotal: new FormControl(0),
    carratMoyen: new FormControl(0),
    arrivage: new FormControl(0),
    statut_achat: new FormControl(2)
  });



  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private purchaseService: PurchaseService,
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
    // Get
    this.getAchatList();
    this.getLot();
  }

  selectedOption: any;

  onOptionSelected() {
    console.log('Option selected:', this.selectedOption);
  }

  tabItem: any[] = []
  // GET ITEM
  PTotal_this: any = 0.0;
  CAR_Total_this: any = 0.0;
  getAchatList(): void {
    this.service.getUnique('achat', 'achatlive.php', this.ID)
      .subscribe({
        next: (data: any) => {
          // console.log("Data all : ", data);
          // Redirection si aucun achat trouver
          if (data[0].length < 1)
            this.router.navigate(['/operation/init-purchase/' + this.ID])

          // INITIATION
          this.Id_achat = data[0][0].id_achat
          this.LastAchat = true;
          this.status_achat = data[0][0].status_achat

          for (let i = 0; i < data.length - 1; i++) {
            // console.log("Item(" + i + ") : ", data[i + 1]);
            this.tabItem.push(data[i + 1])
          }
          if (this.tabItem.length > 0) {
            this.dataItemsList.splice(0, this.dataItemsList.length)
            this.PTotal_this = 0
            this.CAR_Total_this = 0
            this.tabItem.forEach((item) => {
              // this.Id_achat = item.idAchat
              this.PTotal_this += parseFloat(item.poidsItem)
              this.CAR_Total_this += (item.poidsItem * (item.carratItem - item.manquantItem))
            })
            this.getItem()
          }
        }
      })
  }

  // Refresh Item
  getItem() {
    this.service.getUnique('achat', 'getItem.php', this.Id_achat).subscribe({
      next: (data) => {
        console.log("item : ", data);
        if (data.length > 0) {
          this.dataItemsList.splice(0, this.dataItemsList.length)
          this.PTotal_this = 0
          this.CAR_Total_this = 0
          data.forEach((item) => {
            // this.Id_achat = item.idAchat
            this.PTotal_this += parseFloat(item.poidsItem)
            this.CAR_Total_this += (item.poidsItem * (item.carratItem - item.manquantItem))
          })
          // this.dataItemsList = data
          this.dataItemsList = data
        } else {
          // this.snackBar.open("Aucune barres enregistrer au paravant vide !", "Okey")
        }
      }
    })
  }



  // GET Arrivage
  listLot: any = {}
  archivesLot: any[] = []
  lot: any[] = []
  getLot() {
    this.service.LIST('public', 'read.php', 'table_lot').subscribe({
      next: (data) => {
        const todayDate = new Date().getDay();
        // console.log("Lot : ", data);
        data.forEach((item: any) => {
          const dbDate = new Date(item.created_at).getDay();
          // console.log(dbDate);
          if (todayDate === dbDate) {
            // console.log("Egale");
            this.listLot = item
          } else {
            this.archivesLot.push(item)
          }
          this.lot.push(item)
        })
      }
    })
  }



  // Recuper le dernier achat

  // Req
  AchatAddItemsForm(form: FormGroup) {
    if (form.valid) {
      this.Achat.controls.idAchat.setValue(parseFloat(this.Id_achat))
      //Envoyer dans la Base
      this.dataItemsList = [];
      const formData = new FormData()
      formData.append('poidsItem', form.value.poidsItem)
      formData.append('carratItem', form.value.carratItem)
      formData.append('manquantItem', form.value.manquantItem)
      formData.append('idAchat', this.Id_achat)

      this.dataSource.push(this.Achat.value);
      this.service.create('achat', 'createItem.php', formData).subscribe({
        next: (response: any) => {
          // console.log(response);
          this.snackBar.open("Item ajouter avec succès!", undefined, {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ['bg-success', 'text-white']
          });
          this.getItem()
          this.resetForm(form, ["poidsItem", "carratItem", "carratItem"]);
        },
        error: (err: any) => {
          // console.log("Erreur pendant d'ajout : ", err);
          this.snackBar.open("Un petit soucis mais pas grave !" + err, undefined, {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          });
          this.getItem()
          this.resetForm(form, ["poidsItem", "carratItem", "carratItem"]);
        }
      })
    } else {
      // console.log("Formulaire invalid")
      this.snackBar.open("Formulaire non valid !", undefined, {
        duration: 3000,
        horizontalPosition: "center",
        verticalPosition: "bottom",
        panelClass: ['bg-danger', 'text-white']
      });
    }
  }

  resetForm(form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      form.controls[field].setValue(null);
      form.controls[field].updateValueAndValidity();
    })
  }


  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }

  // update Achat
  sendForm = new FormGroup({
    arrivage: new FormControl(0),
    achat: new FormControl(0)
  })

  updateAchat(form: FormGroup): void {
    if (form.valid) {
      let lot = form.value.arrivage
      // console.log(this.Id_achat);
      let cm: any = this.format2Chart(this.CAR_Total_this / this.PTotal_this)
      this.validerAchatForm.controls.id.setValue(this.Id_achat)
      this.validerAchatForm.controls.poidsTotal.setValue(parseFloat(this.PTotal_this))
      this.validerAchatForm.controls.carratMoyen.setValue(parseFloat(cm))
      this.validerAchatForm.controls.arrivage.setValue(parseInt(lot))
      // controle si le tableau d'item n'est pas vide
      //#region
      if (form.value.poidsTotal < 1 || form.value.carratMoyen < 10) {
        this.snackBar.open("Aucune barre , veuillez entrer au moins une barre!", "Okay", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
          panelClass: ['bg-danger', 'text-white']
        })
        form.reset()
        return
      }
      //#endregion
      // const formData = new FormData()
      let formData
      formData = convertObjectInFormData(form.value)
      // console.log("arrivage ", formData);
      if (form.value.arrivage == 0) {
        this.snackBar.open("Veillez d'abord selectionner un lot dans la liste!", "Okay", {
          duration: 3000,
          horizontalPosition: "center",
          verticalPosition: "bottom",
          panelClass: ['bg-danger', 'text-white']
        })
        return
      }

      // console.log("form.value : ", this.validerAchatForm.value);
      this.service.Update('achat', 'update.php', formData)
        .subscribe({
          next: (response) => {
            // console.log("Response : ", response);
            this.snackBar.open("Achat valider", "Okay", {
              duration: 3000,
              horizontalPosition: "center",
              verticalPosition: "bottom",
              panelClass: ['bg-success', 'text-white']
            })
            this.router.navigate(['/operation/facturepurchase/' + this.Id_achat])
          },
          error: (err) => {
            console.log("err : ", err);
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

  // Materiale dataSource
  // save() {
  //   console.log(this.dataSource);
  // }

  deleteItems(id: any) {
    let tab: any[] = [];
    this.dialog.open(DialogMessageComponent, {
      disableClose: true,
      data: {
        title: "Supprimer la ligne",
        message: "Voulez-vous vraiment supprimer cette barre? ",
        messageNo: "Annuler",
        messageYes: "Supprimer"
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        // console.log(data);

        this.purchaseService.delete('public', 'delete.php', 'table_item', id)
          .subscribe({
            next: (value) => {
              console.log("res : ", value);
              // this.PTotal_this =
              this.dataItemsList.map((value, index) => {
                // console.log("VM:", value);
                this.PTotal_this -= value.poidsItem
                this.CAR_Total_this -= value.carratItem
                if (value.id !== id) {
                  tab.push(value)
                }
                this.getItem()
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

  deleteAchat() {
    console.log('id:', this.Id_achat);

    this.dialog.open(DialogMessageComponent, {
      disableClose: true,
      data: {
        title: "Supprimer l'achat'",
        message: "Voulez-vous vraiment supprimer cet achat? ",
        messageNo: "Annuler",
        messageYes: "Supprimer"
      }
    }).afterClosed().subscribe(data => {
      if (data) {
        // console.log(data);
        this.purchaseService.deleteByID('achat', 'delete.php', this.Id_achat)
          .subscribe({
            next: (value) => {
              console.log("res : ", value);
              // this.PTotal_this =
              this.router.navigate(['/operation/purchase/'])
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
