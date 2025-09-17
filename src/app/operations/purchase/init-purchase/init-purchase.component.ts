import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
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
    idFournisseur: [],
    poidsTotal: [0, Validators.required],
    carratMoyen: [0, Validators.required],
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
    this.service.getOneById('achat', 'achatlive.php', this.ID, 'table_achat')
    .subscribe({
      next: (data: any) => {
        console.log("Live achat : ", data);
        // data.forEach((elem: any) => {
        //   if(elem.fournisseur.id == this.ID && elem.status == 1){
        //     // console.log(elem.fournisseur.id);
        //     this.router.navigate(['/operation/add-purchase/' + this.ID])
        //   }
        // })
      }
    })
  }

  lotExist: boolean = false
  date: Date = new Date()
  getLot() {
    // LIST depuis le grand services
    this.service.LIST('public', 'read.php', 'table_lot').subscribe({
      next: (data) => {
        data.forEach((item) => {
          let day = new Date(item.created_at)
          if(this.date.getDay() == day.getDay()){
            this.lotExist = true
          }else{
            this.lotExist = false
          }
        })
      }
    })
  }

  // Init achat form
  InitAchatForm(form: FormGroup) {
    if (form.valid) {
      const formData = new FormData();
      this.initAchat.controls.idFournisseur.setValue(this.ID)
      formData.append("idFournisseur", form.value.idFournisseur);
      // console.log("FormData : ", formData);

      this.service.create('achat', 'init.php', formData).subscribe({
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
          console.log("Error : ", err);

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
