import { Component, OnInit } from '@angular/core';
import { VendorServiceService } from '../../vendor-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-stock-fournisseur',
  templateUrl: './stock-fournisseur.component.html',
  styleUrls: ['./stock-fournisseur.component.css']
})
export class StockFournisseurComponent implements OnInit {

  title = 'Stock Fournisseur'
  selectedValue: string = '';
  selectedCar: string = '';

  // GET ACHAT FOURNISSEUR
  TabItems: any = []
  Poids_total_compte_fournisseur: number = 0

  formControlFournisseur = this.fb.group({
    id: [, Validators.required]
  })

  constructor(
    private activeroute: ActivatedRoute,
    private serviceVendor: VendorServiceService,
    private fb: FormBuilder,
    private router: Router,
    public location: Location
  ) { }

  ID_F: any
  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_F = this.activeroute.snapshot.params['id'];

    this.getFournisseur()
    this.getOneFournisseur()
    this.getAchat()
  }

  fournisseurList: any = []
  getFournisseur(): void {
    this.serviceVendor.getList('api', 'fournisseur').subscribe({
      next: (data) => {
        // console.log(data),
        this.fournisseurList = data
      }
    })
  }

  ID_POST: any
  objetFRS: any
  identifiant_fournisseur: any
  getOneFournisseurPOST(form: FormGroup): void {
    // console.log(form.value.id);
    this.objetFRS = {}
    this.ID_POST = form.value.id
    this.serviceVendor.getElementById('api', 'fournisseur', this.ID_POST).subscribe({
      next: (data) => {
        this.objetFRS = data
      }
    })
    form.reset()
  }

  // ONE FOURNISSEUR
  getOneFournisseur(): void {
    // this.objetFRS = {}
    if (this.ID_F) {
      this.serviceVendor.getElementById('api', 'fournisseur', this.ID_F).subscribe({
        next: (data) => {
          this.objetFRS = data
        }
      })
    }
  }

  Qte_fixer: any
  TabFixing: any = []
  getAchat(): void {
    // console.log(this.objetFRS)
    if (this.ID_F) {
      this.TabItems = []
      this.Poids_total_compte_fournisseur = 0
      this.serviceVendor.getList('api', 'achat_items').subscribe({
        next: (data_: any) => {
          // console.log(data)
          data_.forEach((item: any) => {
            // console.log(this.ID_F);
            if (this.ID_F == item.achat.fournisseur.id) {
              this.TabItems.push(item.poids_achat)
            }
          });
          // console.log(this.TabItems);
          this.Poids_total_compte_fournisseur = this.TabItems.reduce((acc: any, item: any) => acc + item)
        }
      })
      // FIXING FOURNISSEUR GET
      this.serviceVendor.getList('api', 'fixing').subscribe({
        next: (data: any) => {
          console.log(data)
          data.forEach((item_: any) => {
            if (this.ID_F == item_.fournisseur.id && item_.status == 2) {
              this.TabFixing.push(item_.poids_fixe)
            }
          });
          console.log(this.TabFixing);
          this.Qte_fixer = this.TabFixing.reduce((acc: any, item: any) => acc + item)
        }
      })
    }
  }


}
