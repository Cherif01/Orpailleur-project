import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { LotService } from '../lot.service'
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { generatePDF, imprimerDiv } from 'src/app/app.component'

@Component({
  selector: 'app-detail-lot',
  templateUrl: './detail-lot.component.html',
  styleUrls: ['./detail-lot.component.css']
})
export class DetailLotComponent implements OnInit {
  page = 'Lot'

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  constructor (
    private serviceLot: LotService,
    private activeroute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    public location: Location
  ) {}

  Attributions = this.fb.group({
    arrivage: [0, Validators.required],
    achat: [0, Validators.required]
  })

  Attribution = new FormGroup({
    achat: new FormControl(0)
  })

  clotureInfo = new FormGroup({
    id: new FormControl(0),
    status: new FormControl(2)
  })

  title = 'Detail du lot'
  IDLot: any

  ngOnInit (): void {
    this.IDLot = this.activeroute.snapshot.params['id']
    this.LotUniq()
    this.factureLot()
    // this.ListAchat()
  }

  // GET LOT
  LotUnique: any = []
  lotID_unique: number = 0
  listAchat: any[] = []
  LotUniq () {
    this.serviceLot.getOneByIdSimple('lot', 'get.php', this.IDLot).subscribe({
      next: data => {
        // console.log("Res :", data);
        this.LotUnique = data[0]
        data[1][0].forEach((item: any) => {
          // console.log("i", item) ;
          this.List_Achat.push(item)
        })
        // console.log("Data : ", data[1][0]);
        // Liste des achat du lot
      }
    })
  }

  // GET ACHAT
  List_Achat: any = []
  PoidTotalLot: number = 0
  PoidVenduLot: number = 0
  nb_barre: number = 0
  // ListAchat() {
  //   this.serviceLot.LIST('lot', 'attribution').subscribe({
  //     next: (data) => {
  //       console.log("Attribution: ", data);
  //       data.forEach(element => {
  //         if (element.arrivage.id == this.IDLot) {
  //           this.List_Achat.push(element);
  //           console.log(element);
  //           this.serviceLot.getList(LINK_BASE, 'achat_items').subscribe({
  //             next: (n) => {
  //               n.forEach(elem => {
  //                 if (element.achat.id == elem.achat.id) {
  //                   // console.log(elem);
  //                   this.PoidTotalLot += elem.poids_achat
  //                   this.nb_barre += 1
  //                 }
  //               })
  //             }
  //           })
  //         }
  //       })
  //     }
  //   })
  // }

  // Attribuer un achat a un lot
  // AttributionForm(form: FormGroup): void {
  //   if (form.valid) {
  //     //Envoyer dans la Base
  //     // console.log(form.value);
  //     form.reset()
  //     this.router.navigate(['/lot/detail-lot/' + this.IDLot])
  //   } else {
  //     console.log(form.value)
  //   }
  // }

  // CLOTURE DU LOT
  ClotureLot (form: FormGroup): void {
    // if(form.valid) {
    //   this.clotureInfo.controls.id.setValue(this.IDLot)
    //   console.log(form.value);
    //   this.serviceLot.updateResource('api', 'arrivage' ,form.value).subscribe({
    //     next: (reponse: any) => console.log(reponse),
    //     error: (err: any) => console.log(err)
    //   })
    // }
  }

  facture: any = []
  listItemFacture: any[] = []
  objetCreate: any[] = []
  factureLot () {
    this.serviceLot
      .getOneByIdSimple('lot', 'getFacture.php', this.IDLot)
      .subscribe({
        next: data => {
          console.log("Res :", data);
          this.facture = data
          // data[0].forEach((l: any) => {
          //   // console.log("Liste L :", l);
          //   data[1].forEach((e: any) => {
          //     if(l.Numero == e.Numero){
          //       this.listItemFacture.push(e)
          //       // console.log("Liste E :", e);
          //     }
          //   })
          // })
        }
      })
  }




  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }

  generatePDF(nameFournisseur? : string) {
    generatePDF(nameFournisseur);
  }

  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }


}
