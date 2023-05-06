import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-facture-frs',
  templateUrl: './create-facture-frs.component.html',
  styleUrls: ['./create-facture-frs.component.css']
})
export class CreateFactureFrsComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  title = 'Create Facture'
  idGet: any

  Fixing = this.fb.group({
    id: [, Validators.required],
    created_by: [1, Validators.required]
  })

  AchatL = this.fb.group({
    id: [, Validators.required],
    created_by: [1, Validators.required]
  })


  constructor(
    private serviceOperation: PurchaseService,
    private activeroute: ActivatedRoute,
    public location: Location,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    // ID Fournisseur EN GET
    this.idGet = this.activeroute.snapshot.params['id'];

    this.ListFix()
    this.ListAchat()
  }

  resetForm(form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      form.controls[field].setValue(null);
      form.controls[field].updateValueAndValidity();
    })
  }


  // FIXING POST
  _TYPE_: any = false
  idFixing: any
  fixingClick: any = false
  TabItemsFix: any = []
  infosFix: any = []
  fournisseurName: any = ""
  poidsTotal: number = 0
  carratMoyen: number = 0
  fixingPOST(form: FormGroup) {
    this.TabItemsFix = []
    if (form.valid) {
      this.idFixing = form.value.id
      // console.log(form.value.id);
      this.serviceOperation.getList('api', 'fixing_detail')
        .subscribe({
          next: ((data) => {
            data.forEach((item) => {
              if (item.fixing == this.idFixing) {
                if (item.type_envoie == 1) {
                  this._TYPE_ = false
                  this.TabItemsFix.push(item)
                  this.fournisseurName = item.fournisseur.prenom + " " + item.fournisseur.nom
                  // console.log(item);
                  this.poidsTotal += item.achat_items.poids_achat
                  this.carratMoyen += (item.achat_items.poids_achat * item.achat_items.carrat_achat)
                }
                else if (item.type_envoie == 2) {
                  this._TYPE_ = true
                  this.serviceOperation.getList('api', 'achat_items')
                    .subscribe({
                      next: ((ai) => {
                        ai.forEach((a) => {
                          if (a.achat.id == item.achat) {
                            this.TabItemsFix.push(a)
                            // console.log(a);
                            this.poidsTotal += a.poids_achat
                            this.carratMoyen += (a.poids_achat * a.carrat_achat)
                          }
                        });
                        this.resetForm(form,['id'])
                      })
                    })
                } else { }
              }
            })
            this.fixingClick = true;
            this.router.navigate(['operation/create-facture/'])
          })
        })

      this.serviceOperation.getElementById('api', 'fixing', this.idFixing)
        .subscribe({
          next: ((data) => {
            this.infosFix = data
            // console.log(data);
          })
        })

    }
  }

  // ACHAT POST
  achatPOST(form: FormGroup) {

  }

  // LIST FIXING
  ListFixing: any = []
  ListFix(): void {
    this.serviceOperation.getList('api', 'fixing')
      .subscribe({
        next: ((value) => {
          value.forEach((item) => {
            this.ListFixing.push(item)
            // console.log(item);
          })
        })
      })
  }

  // LIST FIXING
  listAchat: any = []
  ListAchat(): void {
    this.serviceOperation.getList('api', 'achat')
      .subscribe({
        next: ((value) => {
          value.forEach((item) => {
            this.listAchat.push(item)
            // console.log(item);
          })
        })
      })
  }

  // SELECT CHANGE
  infosFixing(e: any): void {

  }



  //
  Total: number = 0
  calculPrice(pu: any, poids: any, carrat: any) {
    let Montant = ((pu / 22) * poids * carrat)
    this.Total += Montant
    return Montant
  }

  imprimerDiv(): void {
    let printContents = this.divToPrint.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


}
