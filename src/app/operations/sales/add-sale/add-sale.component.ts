import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { LotService } from 'src/app/lot/lot.service'
import { OperationsService } from '../../operations.service'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Location } from '@angular/common'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { SelectionModel } from '@angular/cdk/collections'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'

// import { Audio } from 'standardized-audio-context';

@Component({
  selector: 'app-add-sale',
  templateUrl: './add-sale.component.html',
  styleUrls: ['./add-sale.component.css']
})
export class AddSaleComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any
  @ViewChild('head') head: ElementRef | any
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null)
  search = new FormControl()
  selection = new SelectionModel<any>(true, [])

  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums = [
    'Date',
    'Client',
    'Lot',
    'Poids',
    'CarratMoyen',
    'Status',
    'Action'
  ]

  dataSource2: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums2 = [
    'Select',
    'Date',
    'Achat',
    'Fournisseur',
    'Poids',
    'Carrat',
    'Manquant'
  ]

  applyFilter (event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource2.filter = filterValue.trim().toLowerCase()
  }

  constructor (
    private serviceLot: LotService,
    private snackBar: MatSnackBar,
    private service: ApiserviceService,
    public location: Location
  ) {}

  title = "Bienvenu dans l'expedition"
  ngOnInit (): void {
    this.getCusters()
    this.getLot()
    this.getListExpedition()
  }

  // LIST EXPEDITION
  PT_SEND: number = 0
  CM_SEND: number = 0
  expeditionDatatable: any
  datatable: any[] = []
  getListExpedition (): void {
    this.service.getList('client', 'getExpedition.php').subscribe({
      next: (data: any) => {
        console.log("Data : ", data);
        this.dataSource.data = data
        this.dataSource.paginator = this.paginator
      }
    })
  }

  // Liste des clients
  TabClient: any[] = []
  getCusters (): void {
    this.service.LIST('public', 'read.php', 'table_client').subscribe({
      next: (client: any) => {
        client.forEach((c: any) => {
          this.TabClient.push(c)
        })
      }
    })
  }

  // Liste des lots
  selectLot: any = false
  TabLot: any[] = []
  idLotSelect: number = 0
  getLot (): void {
    this.serviceLot.LIST('public', 'read.php', 'table_lot').subscribe({
      next: (arrivage: any) => {
        // console.log(data);
        // if (arrivage.length > 0) {
        arrivage.forEach((lot: any) => {
          this.TabLot.push(lot)
        })
        // }
      }
    })
  }

  // Liste des lots
  TabAchat: any[] = []
  selectAchat: any = false
  idAchatSelect: number = 0

  // EXPEDITION OBJET
  expditionObj: any = {
    client_exp: null,
    lot_exp: null,
    achat: null,
    achat_items: null
  }

  // CONTROLE DU BOUTTON D'ENVOIE
  btnSend: any = false

  // Event
  eventClient (event: any): void {
    // console.log("Event CLIENT : ", event);
    this.expditionObj.client_exp = event
  }
  eventLot (event: any): void {
    this.expditionObj.lot_exp = event
    this.selectLot = true
    this.idLotSelect = event
    // console.log("Event LOT : ", event);
  }

  // eventAchat(event: any): void {
  //   this.TabExpedition = []
  //   this.expditionObj.achat = event
  //   this.selectAchat = true
  //   this.checkedAchatDetail = false;
  //   // this.idAchatSelect = event
  //   // console.log("Event ACHAT : ", event);
  //   this.btnSend = true;
  //   // Liste des items contenu dans l'achat selectionner
  //   this.service.getUnique('client', 'item_restant.php', event).subscribe({
  //     next: (data: any) => {
  //       console.log(data);
  //       this.dataSource2.data = data;
  //     },
  //     error: (err: any) => {
  //       console.log("Erreur : ", err);
  //     }
  //   })

  // }

  checkedGlobal = false
  checkedDetail = false
  checkedAchatGlobal = false
  checkedAchatDetail = false

  // Infos poids lot select
  PoidsTotalContenuLot: number = 0
  nbBarres: number = 0
  message: string = ''
  title_message: string = ''
  // LOT GLOBAL
  parAchat () {
    this.checkedGlobal = true
    this.checkedDetail = false
    this.dataSource2.data = []
    // TOUS LES ACHATS CONTENU DANS LE LOT SELECTIONNER
    this.service
      .getUnique('client', 'achat_restant.php', this.idLotSelect)
      .subscribe({
        next: (data: any) => {
          // console.log('data : ', data)
          this.dataSource2.data = data
          // this.dataSource2.paginator = this.paginator
          if (data.length > 0) {
            this.btnSend = true
            this.title_message = "Selectionner les achats a envoyer..."
          }else{
            this.message = "Aucun achat restant pour l'expedition dans ce lot !"
          }
        }
      })
  }

  // LOT DETAILS
  parItems () {
    this.TabExpedition = []
    this.checkedGlobal = false
    this.checkedDetail = true
    this.dataSource2.data = []
    // TOUS LES Items CONTENU DANS LE LOT SELECTIONNER en FONCTION DES ACHATS CORRESPONDANTS...
    this.service
      .getUnique('client', 'item_restant.php', this.idLotSelect)
      .subscribe({
        next: (data: any) => {
          // console.log('data item : ', data)
          this.dataSource2.data = data
          // this.dataSource2.paginator = this.paginator
          if (data.length > 0) {
            this.btnSend = true
            this.title_message = "Selectionner les barres a envoyer..."
          }else{
            this.message = "Aucune barre restante pour l'expedition dans ce lot !"
          }
        }
      })
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected () {
    // console.log(this.selection.selected);
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource2.data.length
    return numSelected === numRows
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows () {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }
    this.selection.select(...this.dataSource2.data)
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel (row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`
  }

  // ENVOIE DE L'EXPEDITION
  TabExpedition: any = []
  SendInToDB: any = []
  sendExpedition (): void {
    let selected = this.selection.selected
    // console.log("SELECTED : ", selected);
    if (this.expditionObj.client_exp == null) {
      this.snackBar.open(
        'Le client ne peut pas etre vide ?, Veuillez reessayer!',
        'Okay',
        {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['bg-danger', 'text-white']
        }
      )
      return
    }

    // console.log('Expedition : ', selected)
    // return;

    let numeroExpedition: any = Math.floor(1000 + Math.random() * 9000);
    selected.forEach(v => {
      this.SendInToDB.push({
        idClient: this.expditionObj.client_exp,
        idLot: this.expditionObj.lot_exp,
        idAchat: v.achatID,
        idItem: v.id
      })
      const formExpeditionData = new FormData()
      formExpeditionData.append('idClient', this.expditionObj.client_exp)
      formExpeditionData.append('arrivage', this.expditionObj.lot_exp)
      formExpeditionData.append('numeroExpedition', numeroExpedition)
      if (v.type == 1) formExpeditionData.append('idAchat', v.achatID)
      if (v.type == 2) formExpeditionData.append('idItem', v.id)
      this.service
        .create('client', 'expedition.php', formExpeditionData)
        .subscribe({
          next: (response: any) => {
            // console.log('RES : ', response)
            this.snackBar.open('Placer avec succès!', 'Okay', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white']
            })
          },
          error: (err: any) => {
            console.log('ERR : ', err)
          }
        })
    })
  }

  // playSound () {
  //   const audio = new Audio()
  //   audio.src = 'assets/click/click3.wav'
  //   audio.load()
  //   audio.play()
  // }
}
