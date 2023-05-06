import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VendorServiceService } from '../../vendor-service.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-situation-fournisseur',
  templateUrl: './situation-fournisseur.component.html',
  styleUrls: ['./situation-fournisseur.component.css']
})
export class SituationFournisseurComponent implements OnInit {

  title = 'Situation Fournisseur'
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
    this.getOneFournisseur()
    this.getAllFixing()
  }


  objetFRS: any
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

  // TOus les fixing fournisseur
  TabFixing: any = []
  FixingTypeUn: any = 0
  FixingTypeAchatDirect: any = 0
  FixingTypeParPoids: any = 0
  getAllFixing(): void {
    if (this.ID_F) {
      this.serviceVendor.getList('api', 'fixing')
        .subscribe({
          next: ((item: any) => {
            item.forEach((element: any) => {
              if (element.fournisseur.id == this.ID_F) {
                this.TabFixing.push(element.id)
              }
            })

            // Liste des item d'achat
            this.TabFixing.forEach((j: any) => {
              // console.log(j);
              this.serviceVendor.getList('api', 'fixing_detail')
                .subscribe({
                  next: ((itemDetail: any) => {
                    itemDetail.forEach((elemDetail: any) => {
                      if (elemDetail.fixing == j) {
                        if (elemDetail.type_envoie == 1) {
                          // un a un : par detail
                          console.log(elemDetail);
                          this.FixingTypeUn += (elemDetail.achat_items.poids_achat);
                        } else if (elemDetail.type_envoie == 2) {
                          // Achat -> cherchons les items de l'achat
                        } else {
                          // Envoie par poids
                        }
                      }

                    })
                  })
                })
            })

          })
        })


    }
  }



}
