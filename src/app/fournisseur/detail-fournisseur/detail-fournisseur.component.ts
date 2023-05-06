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

  title = "Detail fournisseur"
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
    this.getAllIPurchaseFourn()
    this.getAllIFixingFourn()
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
  onSubscribePurchage2: any
  getAllIPurchaseFourn() {
    this.onSubscribePurchage2 = this.service_vendor
      .getList('api', 'achat_items')
      .pipe(
        map(data => {
          let result: any[] = [];
          // console.log(data)
          data.forEach(item => {
            // let index = result.findIndex(i => i.slug === item.slug);
            if (this.ID_F == item.achat.fournisseur.id) {
              // console.log(item);
              this.Poids_total_compte_fournisseur += item.poids_achat
              result.push(item);
            } else {
              // result[index].poids_achat += item.poids_achat;
            }
          });
          // console.log(this.dataSource.data);
          // console.log(result);
          return result;
        })
      )
      .subscribe(data => {
        this.TabItems = data;
      });
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
        console.log(this.TabCompteGNF);
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
        numero_compte_fournis: this.ID_F + "-" + Math.round(Math.random() * 100) + "-" + Math.round(Math.random() * 10000000),
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
      // setTimeout(()=>{
      //   this.router.navigate(['/fournisseur/detail-fournisseur/'+ this.ID_F])
      // }, 500)
      form.reset()
    } else {
      console.log(form.value)
    }
  }


  openDialog() {
    this.dialog.open(DialogConvertMoneyComponent, {
    }).afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === "convertir") {
          console.log(result.data);
          //Envoyer dans la Base
          // this.service.clientPost(result.data).subscribe({
          //   next: (response) => {
          //     this.snackBar.open("Client enregistre avec succès !", "Okay", {
          //       duration: 3000,
          //       horizontalPosition: "right",
          //       verticalPosition: "top",
          //       panelClass: ['bg-success', 'text-white']

          //     })
          //   },
          //   error: (err) => {
          //     this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
          //       duration: 3000,
          //       horizontalPosition: "left",
          //       verticalPosition: "top",
          //       panelClass: ['bg-danger', 'text-white']
          //     })
          //   }
          // })
        }
      })
  }



  // GET FIXING FOURNISSEUR
  TabFixing: any = []
  Qte_fixer: any
  onSubscribePurchage3: any
  getAllIFixingFourn() {
    // this.onSubscribePurchage3 = this.service_vendor
    //   .getList('api', 'fixing')
    //   .pipe(
    //     map(data => {
    //       let result: any[] = [];
    //       console.log(data)
    //       data.forEach(item => {
    //         // let index = result.findIndex(i => i.slug === item.slug);
    //         if (this.ID_F == item.fournisseur && item.status == 1) {
    //           // console.log(item);
    //           this.Poids_total_fixe_fournisseur += item.poids_fixe
    //           result.push(item);
    //         } else {
    //           // result[index].poids_achat += item.poids_achat;
    //         }
    //       });
    //       // console.log(this.dataSource.data);
    //       // console.log(result);
    //       return result;
    //     })
    //   )
    //   .subscribe(data => {
    //     this.TabItems = data;
    //   });

    // FIXING FOURNISSEUR GET
    this.service.getList('api', 'fixing').subscribe({
      next: (data: any) => {
        // console.log(data)
        data.forEach((item_: any) => {
          if (this.ID_F == item_.fournisseur.id && item_.status == 2) {
            this.TabFixing.push(item_.poids_fixe)
          }
        });
        // console.log(this.TabFixing);
        this.Qte_fixer = this.TabFixing.reduce((acc: any, item: any) => acc + item,0)
      }
    })
  }


}
