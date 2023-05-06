import { Component, OnInit } from '@angular/core';
import { LINK_BASE } from 'src/app/config';
import { LotService } from '../lot.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-attribution',
  templateUrl: './attribution.component.html',
  styleUrls: ['./attribution.component.css']
})
export class AttributionComponent implements OnInit {

  attributionAchat = this.fb.group({
    arrivage: [, Validators.required],
    achat: [0, Validators.required],
    created_by: [1, Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceLot: LotService,
    private activeroute: ActivatedRoute,
    private snackBar: MatSnackBar,
    public location: Location
  ) { }
  title = "Lot"
  listAchatNATTR: any = []
  currentDate = new Date();
  ID_ATTR: any = 0

  ngOnInit(): void {
    this.ID_ATTR = this.activeroute.snapshot.params['id'];
    this.getLot()
    this.getAchat_NATTR()
    this.getAttribution()
  }

  // GET ATTRIBUTION
  oneGet: any = []
  tabID: any = []
  test: any = false
  selected = 'option2';
  getAttribution() {
    this.serviceLot.getAttribution(LINK_BASE, 'attribution').subscribe({
      next: (data) => {
        data.forEach((attribution: any) => {
          console.log(attribution);

          this.tabID.push(attribution.achat.id)
          // console.log(this.tabID);
          if (attribution.achat.id == this.ID_ATTR) {
            this.test = true
            this.oneGet.push(attribution)
            // console.log(attribution);
            // console.log(this.oneGet);
          }
        })
      }
    })
  }

  // GET Arrivage
  getAchat_NATTR() {
    this.serviceLot.getList(LINK_BASE, 'achat').subscribe({
      next: (dataAchat) => {
        this.listAchatNATTR = dataAchat
      }
    })
  }

  // GET Arrivage
  listLot: any = []
  getLot() {
    this.serviceLot.getList(LINK_BASE, 'arrivage').subscribe({
      next: (data) => {
        data.forEach((item: any) => {
          if (item.status == 1) {
            this.listLot.push(item)
          }
        })
      }
    })
  }

  // Req
  addAttr(form: FormGroup) {
    if (form.valid) {
      //Envoyer dans la Base
      this.attributionAchat.controls.achat.setValue(parseInt(this.ID_ATTR))
      console.log(form.value)
      this.serviceLot.PostElement('api', 'attribution', form.value).subscribe({
        next: (response) => {
          this.snackBar.open("Cet achat est maintenant attribuer a un lot !", "Okay", {
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
      this.router.navigate(['/lot/attribution-lot/'])
      form.reset()
    } else {
      console.log(form.value)
    }
  }

  playSound() {
    const audio = new Audio();
    audio.src = 'assets/click/click3.wav';
    audio.load();
    audio.play();
  }

}
