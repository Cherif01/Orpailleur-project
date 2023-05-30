import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { PurchaseService } from '../purchase.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-init-purchase',
  templateUrl: './init-purchase.component.html',
  styleUrls: ['./init-purchase.component.css']
})
export class InitPurchaseComponent implements OnInit {

  DENSITE = 22;
  slug = ""
  dataSource: any[] = [];
  dataItems: any = []
  dataItemsList: any = []

  // init
  initAchat = this.fb.group({
    fournisseur: [],
    poids_total: [0, Validators.required],
    carra_moyen: [0, Validators.required],
    created_by: [1, Validators.required]
  })

  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public location: Location
  ) {
    // this.slug = new Date().getTime()+""+ Math.round(Math.random()* 100000000)
    // this.slug = Math.round(Math.random() * 100000000).toString();
  }

  title = 'Init - Achat';
  FournisseurGet: any
  ID: any = 0
  dataAchat: any
  LastAchat: any = false
  Id_achat: any
  slugSession: any


  ngOnInit(): void {
    this.ID = this.activeroute.snapshot.params['id'];

    this.getLot()
    this.getLastPurchase()
  }


  // Recuper le dernier achat
  getLastPurchase() {
    this.service.getList('api', 'achat')
    .subscribe((donnees: any[]) => {
      donnees.forEach((elem: any) => {
        if(elem.fournisseur.id == this.ID && elem.status == 1){
          // console.log(elem.fournisseur.id);
          this.router.navigate(['/operation/add-purchase/' + this.ID])
        }
      })
    })
  }

  lotExist: boolean = false
  getLot() {
    this.service.getList('api', 'arrivage').subscribe({
      next: (data) => {
        this.lotExist = true
      }
    })
  }

  // Init achat form
  InitAchatForm(form: FormGroup) {
    if (form.valid) {
      this.initAchat.controls.fournisseur.setValue(this.ID)
      this.initAchat.controls.created_by.setValue(1)
      this.service.achatAddPost(form.value).subscribe({
        next: (response) => {
          this.snackBar.open("Achat initialiser avec succès !", "Okay", {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          })
          this.router.navigate(['/operation/add-purchase/' + this.ID])
        },
        error: (err) => {
          this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
            duration: 4000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })
      // setTimeout(() => {
        // }, 500)
      // form.reset()
    } else {
      console.log(form.value)
    }
  }

}
