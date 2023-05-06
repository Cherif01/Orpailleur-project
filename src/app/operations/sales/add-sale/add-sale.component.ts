import { Component, ElementRef, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LINK_BASE, LINK_BASE_CLIENT } from 'src/app/config';
import { LotService } from 'src/app/lot/lot.service';
import { OperationsService } from '../../operations.service';
import { MatSnackBar } from '@angular/material/snack-bar';

// import { Audio } from 'standardized-audio-context';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  // Form Init
  InitVente = this.fb.group({
    client: [, Validators.required],
    created_by: [1, Validators.required],
  })

  // Form
  FactureClient = this.fb.group({
    achat_item: [],
    vente: [0, Validators.required],
    type: [, Validators.required],
    created_by: [1, Validators.required],
  })

  constructor(
    private serviceLot: LotService,
    private OperationService: OperationsService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  title = 'Ajout d\'une vente';
  IDAttr: any
  listLot: any
  lotCliquer: string = ""

  ngOnInit(): void {
    this.IDAttr = this.activeroute.snapshot.params['id'];
    this.getLastSaleForCustomer()
    this.getCustomer()
    this.getLot()
    this.ListAchat()
    this.getFournisseurAchat()
    this.listAttributionLot()
  }

  // Verification si une vente est en cours au nom du client actif
  venteEnCoursSearch: any = []
  venteClient: any = []
  venteActif: any = false
  ID_VENTE: number = 0
  // GET Last sale
  getLastSaleForCustomer() {
    this.serviceLot.getList(LINK_BASE_CLIENT, 'vente').subscribe({
      next: (data) => {
        // console.log(data);
        this.venteEnCoursSearch = data
        this.venteEnCoursSearch.forEach((data: any) => {
          if (data.client.id == this.IDAttr) {
            this.ID_VENTE = data.id
            this.venteActif = true
            this.venteClient.push(data)
          }
        })
        // console.log(data)
      }
    })
  }

  // GET CLIENT
  listClient: any = []
  getCustomer() {
    this.serviceLot.getList(LINK_BASE_CLIENT, 'client').subscribe({
      next: (data) => {
        this.listClient = data
        // console.log(data)
      }
    })
  }

  // GET LOT
  getLot() {
    this.serviceLot.getList(LINK_BASE, 'arrivage').subscribe({
      next: (data) => {
        this.listLot = data
        // console.log(data)
      }
    })
  }

  // Value Lot
  AchatList: any = []
  list: any = false
  lotBoolean: any = false
  Lot_id: number = 0
  LotUnique: any = []
  lotValue(idLot: any): void {
    this.list = false
    // console.log("Lot envoyer : ", + idLot);
    this.OperationService.getList(LINK_BASE, 'attribution').subscribe({
      next: (data: any) => {
        // console.log(data)
        this.AchatList.splice(0, this.AchatList.length);
        data.forEach((value: any) => {
          // console.log(value);
          if (idLot == value.arrivage.id) {
            // console.log(value);
            this.list = true;
            this.AchatList.push(value);

            this.serviceLot.getList(LINK_BASE, 'achat_items').subscribe({
              next: (n) => {
                n.forEach(elem => {
                  if (value.achat.id == elem.achat.id) {
                    // console.log(elem);
                    this.PoidTotalLot += elem.poids_achat
                    this.nb_barre += 1
                  }
                })
              }
            })
          }
        })
      }
    })

    this.OperationService.getList(LINK_BASE, 'arrivage').subscribe({
      next: (data) => {
        data.forEach(item => {
          if (item.id == idLot) {
            // console.log(item);
            this.lotBoolean = true;
            this.LotUnique = item
            // ACHAT
          }
        })
        // console.log(this.LotUnique)
      }
    })

  }

  // GET ACHAT
  List_Achat: any = []
  PoidTotalLot: number = 0
  PoidVenduLot: number = 0
  nb_barre: number = 0
  ListAchat() {
    this.serviceLot.getList(LINK_BASE, 'attribution').subscribe({
      next: (data) => {
        data.forEach(element => {
          if (element.arrivage.id == this.Lot_id) {
            this.List_Achat.push(element);
            // console.log(element);
            this.serviceLot.getList(LINK_BASE, 'achat_items').subscribe({
              next: (n) => {
                n.forEach(elem => {
                  if (element.achat.id == elem.achat.id) {
                    // console.log(elem);
                    this.PoidTotalLot += elem.poids_achat
                    this.nb_barre += 1
                  }
                })
              }
            })
          }
        })
      }
    })
  }

  // Facture en f(x) de l'achat choisis
  ItemsList: any = []
  listItems: any = false
  Poids_total: number = 0
  carrat_moyenne: number = 0
  nbBarres: number = 0
  ID_ACHAT_ENCOURS: number = 0
  itemValue(idAchat: any): void {
    this.ID_ACHAT_ENCOURS = idAchat
    // console.log("Achat envoyer : ", + idAchat);
    this.OperationService.getList(LINK_BASE, 'achat_items').subscribe({
      next: (data: any) => {
        this.Poids_total = 0
        this.carrat_moyenne = 0
        this.nbBarres = 0
        // console.log(data)
        this.ItemsList.splice(0, this.ItemsList.length);
        data.forEach((value: any) => {
          // console.log(value);
          if (idAchat == value.achat.id) {
            // console.log(value);
            this.Poids_total += value.poids_achat
            this.carrat_moyenne += value.carrat_achat
            this.nbBarres += 1
            this.listItems = true;
            this.ItemsList.push(value);
          }
        })
      }
    })
  }


  // OPTION DE VENTE
  Detail: any = false
  Global: any = false
  optionValue(idOption: any): void {
    console.log(idOption);
    if (idOption == 1) {
      this.Global = false;
      this.Detail = true;
    } else {
      this.Detail = false;
      this.Global = true;
    }
  }

  // GET ATTRIBUTION
  listAttribution: any = []
  PoidTotal: number = 0
  listAttributionLot() {
    this.serviceLot.getList(LINK_BASE, 'attribution').subscribe({
      next: (data) => {
        this.IDAttr = this.activeroute.snapshot.params['id'];
        this.listAttribution.splice(0, this.listAttribution.length);
        // console.log(this.IDAttr);
        // console.log(data);
        data.forEach(item => {
          if (item.arrivage.id == this.IDAttr) {
            this.serviceLot.getList(LINK_BASE, 'achat_items').subscribe({
              next: (dataItem) => {
                // console.log(dataItem);
                data.forEach(itemAchat => {
                  if (itemAchat.achat.id == item.achat.id) {
                    this.PoidTotal += itemAchat.achat.poids_achat
                  }
                })
              }
            })
            // console.log(item);
            this.listAttribution.push(item);
          }
        })
        // console.log(this.listAttribution)
      }
    })
  }

  playSound() {
    const audio = new Audio();
    audio.src = 'assets/click/click3.wav';
    audio.load();
    audio.play();
  }


  // GET
  FournisseurList: any = []
  getFournisseurAchat() {
    this.OperationService.getList(LINK_BASE, 'fournisseur').subscribe({
      next: (data) => {
        this.FournisseurList = data
      }
    })
  }


  // POST
  InitVentePost(form: FormGroup): void {
    if (form.valid) {
      console.log(form.value);
      this.OperationService.Add(form.value, 'client_api', 'vente').subscribe({
        next: (response) => {
          this.snackBar.open("Vente initialiser avec succès !", "Okay", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          })
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
      this.router.navigate(['/operation/add-sales/' + form.value.client])
      form.reset()
      // Déclencher la détection de changement
    }
  }

  // POST FACTURE CLIENT
  FactureClientPOST(form: FormGroup, id: any): void {
    if (form.valid) {
      this.FactureClient.controls.vente.setValue(this.ID_VENTE)
      this.FactureClient.controls.achat_item.setValue(id)
      console.log(form.value);
      this.OperationService.Add(form.value, LINK_BASE_CLIENT, 'vente_detail').subscribe({
        next: (response) => {
          this.snackBar.open("Vente envoyer avec succès !", "Okay", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: ['bg-success', 'text-white']

          })
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
      form.reset()
      window.location.reload()
      // this.router.navigate(['/operation/add-sales/' + this.IDAttr])
    }
  }


}
