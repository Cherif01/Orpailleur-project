import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LINK_BASE } from 'src/app/config';
import { LotService } from 'src/app/lot/lot.service';
import { OperationsService } from '../../operations.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

// import { Audio } from 'standardized-audio-context';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();
  selection = new SelectionModel<any>(true, []);

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["Date", "Client", "Lot", "Poids", "CarratMoyen", "Status", "Action"];

  dataSource2: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums2 = ['Select', 'Date', 'Fournisseur', 'Achat', 'Poids', 'Carrat', 'Manquant'];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private serviceLot: LotService,
    private OperationService: OperationsService,
    private activeroute: ActivatedRoute,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router,
    public location: Location
  ) { }

  title = 'Ajout d\'une vente';
  ngOnInit(): void {
    this.getCusters()
    this.getLot()
    this.getListExpedition()
  }

  // LIST EXPEDITION
  PT_SEND: number = 0
  CM_SEND: number = 0
  expeditionDatatable: any
  datatable: any[] = []
  getListExpedition(): void {
    this.OperationService.getList('client_api', 'expedition/1/liste_expeditions')
      .subscribe({
        next: (response: any) => {
          // console.log("list : ", response);
          // console.log("list : ", response.data);
          response.data.forEach((res: any) => {
            this.PT_SEND = 0
            this.CM_SEND = 0
            // console.log("res : ", res.achat_items);
            res.achat_items.forEach((item: any) => {
              this.PT_SEND += item.poids
              this.CM_SEND += (item.poids * item.carrat)
              // console.log("item : ", item);
            }) // fin boucle parcours boucle achat items
            this.expeditionDatatable = {
              created_at: res.created_at,
              raison_socile: res.raison_socile,
              lot: res.lot,
              poidsTotal: this.PT_SEND,
              carratMoyen: (this.CM_SEND),
            }
            // console.log("OBJET : ", this.expeditionDatatable);
            this.datatable.push(this.expeditionDatatable)
          })
          this.dataSource.data = this.datatable
        },
        error: (err: any) => console.log("erreur : ", err)

      })
  }


  // Liste des clients
  TabClient: any[] = [];
  getCusters(): void {
    this.OperationService.getList('client_api', 'client').subscribe({
      next: (client: any) => {
        client.forEach((c: any) => {
          this.TabClient.push(c)
        })
      }
    })
  }

  // Liste des lots
  selectLot: any = false
  TabLot: any[] = [];
  idLotSelect: number = 0;
  getLot(): void {
    this.OperationService.getList('api', 'arrivage')
      .subscribe({
        next: (arrivage: any) => {
          arrivage.forEach((lot: any) => {
            this.TabLot.push(lot)
          })
        }
      })
  }

  // Liste des lots
  TabAchat: any[] = [];
  selectAchat: any = false
  idAchatSelect: number = 0;

  // EXPEDITION OBJET
  expditionObj: any = {
    client_exp: null,
    lot_exp: null,
    achat: null,
    achat_items: null,
    type_envoie: 1,
    status: 2,
    created_by: 1
  }

  // CONTROLE DU BOUTTON D'ENVOIE
  btnSend: any = false

  // Event
  eventClient(event: any): void {
    console.log("Event CLIENT : ", event);
    this.expditionObj.client_exp = event
  }
  eventLot(event: any): void {
    this.expditionObj.lot_exp = event
    this.selectLot = true
    this.idLotSelect = event
    console.log("Event LOT : ", event);
  }
  eventAchat(event: any): void {
    this.TabExpedition = []
    this.expditionObj.achat = event
    this.expditionObj.type_envoie = 2
    this.selectAchat = true
    this.checkedAchatDetail = false;
    // this.idAchatSelect = event
    // console.log("Event ACHAT : ", event);
    this.btnSend = true;
    // Liste des items contenu dans l'achat selectionner
    this.serviceLot.getItemsOfAchat('api', 'achat_items', event).subscribe({
      next: (data: any) => {
        // console.log(data);
        this.dataSource2.data = data;
      },
      error: (err: any) => {
        console.log("Erreur : ", err);
      }
    })

  }

  checkedGlobal = false;
  checkedDetail = false;
  checkedAchatGlobal = false
  checkedAchatDetail = false


  // Infos poids lot select
  PoidsTotalContenuLot: number = 0
  nbBarres: number = 0
  // LOT GLOBAL
  checkedG() {
    this.checkedGlobal = true;
    this.checkedDetail = false
    this.btnSend = true
    // Liste des items contenu dans le lot selectionner
    this.PoidsTotalContenuLot = 0
    this.nbBarres = 0
    this.serviceLot.getLotContentById(LINK_BASE, 'arrivage', this.idLotSelect).subscribe({
      next: (data: any) => {
        data.data.forEach((item: any) => {
          // console.log("Lot : ", item);
          this.TabExpedition.push(item);
          this.PoidsTotalContenuLot += parseFloat(item.poids_achat)
          this.nbBarres += 1
        })
        this.dataSource2.data = data.data;
      }
    })
  }

  // LOT DETAILS
  checkedD() {
    this.TabExpedition = []
    this.checkedGlobal = false
    this.checkedDetail = true;
    this.btnSend = false
    // LISTE DES ACHATS
    this.serviceLot.getAchatOfLot('api', 'achat', this.idLotSelect)
      .subscribe({
        next: (achat: any) => {
          achat.data.forEach((elem: any) => {
            // console.log(elem);
            this.TabAchat.push(elem)
          })
        }
      })
  }

  checkedAchatG() {
    this.checkedAchatGlobal = true;
    this.checkedAchatDetail = false
    this.btnSend = true;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // console.log(this.selection.selected);
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource2.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource2.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  // ENVOIE DE L'EXPEDITION
  TabExpedition: any = []
  sendExpedition(): void {

    let selected = this.selection.selected;
    let poids: any = 0

    // console.log("selected : ", selected);

    selected.forEach(v => {
      poids += Number(v.poids_achat)
      this.TabExpedition.push({
        client_exp: this.expditionObj.client_exp,
        lot_exp: this.expditionObj.lot_exp,
        achat_items: v.id,
        type_envoie: 2,
        status: 2,
        created_by: 1
      });
    });

    if(this.expditionObj.client_exp == null) {
      this.snackBar.open("Le client ne peut pas etre vide ?, Veuillez reessayer!", "Okay", {
        duration: 3000,
        horizontalPosition: "right",
        verticalPosition: "bottom",
        panelClass: ['bg-danger', 'text-white']
      })
      return
    }

    console.log("EXPEDITION : ", this.TabExpedition);
    // DEBLOQUER ET ENVOYER DANS LA BDD
    this.serviceLot.Add('client_api', 'expedition/1/create_expedition', this.TabExpedition)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.snackBar.open("Expedition ajouter avec succès!", "Okay", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          })
          window.location.reload()
        },
        error: (err) => {
          this.snackBar.open("Donnees deja expedier, Veuillez reessayer!", "Okay", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })

  }




  playSound() {
    const audio = new Audio();
    audio.src = 'assets/click/click3.wav';
    audio.load();
    audio.play();
  }


}
