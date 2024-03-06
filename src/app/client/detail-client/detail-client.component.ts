import { SelectionModel } from '@angular/cdk/collections'
import { DatePipe, Location } from '@angular/common'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute } from '@angular/router'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { imprimerDiv } from 'src/app/app.component'
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component'
import { OperationClientComponent } from 'src/app/etat-entreprise/caisse-principale/operation-client/operation-client.component'
import { FixingClientDialogComponent } from 'src/app/etat-entreprise/fixing-client-dialog/fixing-client-dialog.component'

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.css']
})
export class DetailClientComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any
  @ViewChild('divToPrint_') divToPrint_: ElementRef | any
  @ViewChild('head') head: ElementRef | any
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null)
  search = new FormControl()
  selection = new SelectionModel<any>(true, [])

  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums = [
    'select',
    'Date',
    'Client',
    'Lot',
    'Type',
    'Poids',
    'CarratMoyen'
  ]

  // LIST FIXING
  dataSource2: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums2: string[] = [
    'date',
    'fixing',
    'discounte',
    'p_unit',
    'pds_fixe',
    'pds_vendu',
    'pds_restant'
  ]

  // EXPEDITION VALIDER
  dataSource3: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums3 = [
    'Date',
    'Client',
    'Lot',
    'Poids',
    'CarratMoyen',
    'Fixing',
    'Discompte',
    'Prix',
    'Densite',
    'Montant',
    'Statut'
  ]

  constructor (
    private activeroute: ActivatedRoute,
    private dialog: MatDialog,
    public location: Location,
    private service: ApiserviceService,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }
  filterTable (v: any) {
    this.dataSource.filter = v?.trim()?.toLowerCase()
    this.dataSource2.filter = v?.trim()?.toLowerCase()
    this.dataSource3.filter = v?.trim()?.toLowerCase()
  }

  clientOperation = new FormGroup({
    operation_client: new FormControl('', [Validators.required]),
    montant_client: new FormControl('', [Validators.required])
  })

  title = 'SOCIETE : '
  Id_client: any
  ngOnInit (): void {
    // ID ACHAT EN GET
    this.Id_client = this.activeroute.snapshot.params['id']
    this.getInfo()
    this.getCaisse()
    this.goRapport()
    this.getListExpedition()
    this.getFacture()
    this.getListFixing()
    this.getListExpedition_valider()
  }

  // GET Fournisseur
  infoClient: any = {}
  getInfo () {
    this.service
      .getUnique('client', 'getInfoOne.php', this.Id_client)
      .subscribe({
        next: (data: any) => {
          // console.log("Client : ", data);
          this.infoClient = data
        }
      })
  }

  // LIST EXPEDITION
  PT_SEND: number = 0
  CM_SEND: number = 0
  expeditionDatatable: any
  datatable: any[] = []
  PTotalExpedition: any = 0
  // GET BY POIDS
  getListExpedition (): void {
    this.service
      .LIST_BY_ID('client', 'getByPoidsClient.php', this.Id_client)
      .subscribe({
        next: (data: any) => {
          // console.log('Liste expedition poids : ', data)
          this.datatable = data
          this.dataSource.data = data
          data.forEach((v: any) => {
            this.PTotalExpedition += parseFloat(v.poids)
          })
        },
        error: (err: any) => console.log('erreur : ', err)
      })
  }
  // VALIDER
  getListExpedition_valider (): void {
    this.service
      .LIST_BY_ID('client', 'get_by_client_valider.php', this.Id_client)
      .subscribe({
        next: (response: any) => {
          // console.log('Valider : ', response);
          // this.factureHistorique = response[0]
          this.dataSource3.data = response[0]
        },
        error: (err: any) => console.log('erreur : ', err)
      })
  }

  // GET Facture by fixing...
  dataFacture: any[] = []
  getFacture (): void {
    this.service
      .LIST_BY_ID('client', 'getFactureFixing.php', this.Id_client)
      .subscribe({
        next: (response: any) => {
          // console.log('List : ', response);
          this.dataFacture = response
        },
        error: (err: any) => console.log('erreur : ', err)
      })
  }

  factureHistorique: any[] = []
  MTotal = 0
  PTotal = 0
  CMoyen = 0
  InfoFixing: any = {}
  getOneFacture (idFixing: any): void {
    this.MTotal = 0
    this.PTotal = 0
    this.CMoyen = 0
    this.factureHistorique = []
    this.service.LIST_BY_ID('client', 'getOneFacture.php', idFixing).subscribe({
      next: (response: any) => {
        console.log('Valider : ', response);
        this.factureHistorique = response[0]
        this.MTotal = parseFloat(response[1])
        this.InfoFixing = response[0][0]
        let cSum = 0
        response[0].forEach((v: any) => {
          // console.log("V : ", v);
          this.PTotal += parseFloat(v.poidsItem)
          cSum += parseFloat(v.poidsItem) * parseFloat(v.carratItem)
        })
        this.CMoyen = cSum / this.PTotal
      },
      error: (err: any) => console.log('erreur : ', err)
    })
  }

  ListFixing: any[] = []
  getListFixing (): void {
    this.service
      .LIST_BY_ID('client', 'getFixing.php', this.Id_client)
      .subscribe({
        next: (response: any) => {
          // console.log('response : ', response);
          this.dataSource2.data = response
          this.ListFixing = response
          // response.forEach((data: any) => {
          //   this.ListFixing.push(data)
          //   console.log("List : ", data);
          // })
        },
        error: (err: any) => console.log('erreur : ', err)
      })
  }

  addMouvClient (form: FormGroup) {
    console.log('Form : ', form.value)
  }

  // Fixing client dialog
  openDialogFix () {
    this.dialog
      .open(FixingClientDialogComponent, {})
      .afterClosed()
      .subscribe(result => {
        if (result?.event && result.event === 'insert') {
          let form: any = result.data
          form.idClient = this.Id_client
          // console.log("FORM FIXING : ", form);
          this.saveFixing(form)
        }
      })
  }

  // Operation caisse dialog
  openDialog () {
    this.dialog
      .open(OperationClientComponent, {})
      .afterClosed()
      .subscribe(result => {
        if (result?.event && result.event === 'insert') {
          let form: any = result.data
          form.devise = 2
          form.idClient = this.Id_client
          // Entree de caisse
          this.service.LIST_ALL_PRECIS('caisse', 'solde.php').subscribe(v => {
            if (form.operation == 5) {
              // Reception (5)
              form.montant_anterieur = v[0].soldeUSD + form.montant
            } else if (form.operation == 6) {
              // Paiemnt cash (6)
              form.montant_anterieur = v[0].soldeUSD - form.montant
            }
            // console.log(form);
            this.save(form)
          })
        }
      })
  }

  // CAISSE ELEMENT
  EntrerClient = 0
  SortieClient = 0
  SoldeFinal = 0

  historique: any[] = []
  Today_h: any = new DatePipe('en_EN').transform(new Date(), 'yyyy/MM/dd')
  rechercheIntervalleForm = new FormGroup({
    dateStart: new FormControl<Date>(this.Today_h, Validators.required),
    dateEnd: new FormControl<Date | null>(null)
  })
  getCaisse (): void {
    //console.log(this.rechercheIntervalleForm.value);
    if (this.rechercheIntervalleForm.valid) {
      let values = this.rechercheIntervalleForm.value
      this.service
        .LIST_SEARCH('public', 'readbyclause.php', 'table_caisse', {
          startDate: new Date(values.dateStart!).getTime(),
          endDate: values.dateEnd
            ? new Date(values.dateEnd).getTime()
            : new Date(values.dateStart!).getTime()
        })
        .subscribe({
          next: (data: any) => {
            // console.log("DATA : ", data);
            data.forEach((value: any) => {
              if (this.Id_client == value.idClient) {
                if (value.operation == 5 || value.operation == 6) {
                  this.historique.push(value)
                  if (value.operation == 5) {
                    this.EntrerClient += parseFloat(value.montant)
                  } else if (value.operation == 6) {
                    this.SortieClient += parseFloat(value.montant)
                  }
                }
              }
            })
            this.SoldeFinal = this.EntrerClient - this.SortieClient
            // console.log("SOLDE : ", this.EntrerClient, this.SortieClient);
          }
        })
    }
  }

  save (form: any) {
    let f = convertObjectInFormData(form)
    // console.log(f);
    this.service.create('caisse', 'create.php', f).subscribe(v => {
      this.getCaisse()
    })
  }

  saveFixing (form: any) {
    let f = convertObjectInFormData(form)
    // console.log(f);
    this.service.create('client', 'addFixing.php', f).subscribe(v => {
      // this.getCaisse()
      window.location.reload()
    })
  }

  // SHOW && HIDE FACTURE
  showFacture: boolean = false
  hideFacture: boolean = false
  showDiv (): void {
    this.hideFacture = false
    this.showFacture = true
  }
  hideDiv (): void {
    this.hideFacture = true
    this.showFacture = false
  }
  // SHOW && HIDE FACTURE

  format2Chart (data: any) {
    let tab = data.toString().split('.')
    if (tab.length < 2) return Number(data)
    return Number(tab[0].concat('.', tab[1].substr(0, 2)))
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected () {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows () {
    if (this.isAllSelected()) {
      this.selection.clear()
      return
    }
    this.selection.select(...this.dataSource.data)
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

  validationFixing = new FormGroup({
    idFixing: new FormControl('', Validators.required),
    idClient: new FormControl(''),
    idItem: new FormControl(''),
    idAchat: new FormControl(''),
    codeGenerer: new FormControl('')
  })
  // Envoie dans du fixing dans la db
  objetFixer: any = []
  logSelected (idFixing: any) {
    let selected = this.selection.selected
    let code: any = Math.floor(Math.random() * (1000000 - 1000 + 1)) + 2023
    if (selected.length < 1)
      this.snackBar.open('Aucune selection... !', 'Merci!', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['bg-danger', 'text-white']
      })

    // ENVOIE DU FIXING DETAIL POUR LE CLIENT (F-VITEM-CLIENT)
    selected.forEach(v => {
      // console.log('v ', v)
      const formData = new FormData()
      formData.append('idFixing', idFixing)
      formData.append('idClient', this.Id_client)
      formData.append('idItem', v.item)
      formData.append('idAchat', v.achat)
      formData.append('codeGenerer', code)
      // formData.append('statut_fixing_vitem_client', this)

      // console.log('FormData : ', formData);
      // console.log(idFixing, this.Id_client);
      // return 0

      // this.snackBar.open('VENTE NON AUTORISE POUR LE MOMENT... !', 'Merci!', {
      //   duration: 5000,
      //   horizontalPosition: 'right',
      //   verticalPosition: 'top',
      //   panelClass: ['bg-danger', 'text-white']
      // })

      this.service
        .create('client', 'addfixingclient1.php', formData)
        .subscribe({
          next: (response: any) => {
            // console.log("RESPONSE : ", response);
            this.snackBar.open('Or expedier !', 'Merci!', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white']
            })
            if (response) window.location.reload()
          }
        })
    })
  }

  // RAPPORT GET
  // Event Rapport
  Name: any
  fusionTab: any[] = []
  SoldeGNF: number = 0
  SoldeUSD: number = 0
  // ITEM
  ListItem: any = []
  PoidsTotal_barre: number = 0
  manquantTotal: number = 0
  CMoyen_: number = 0
  goRapport (): any {
    this.service
      .getUnique('client', 'operation.php', this.Id_client)
      .subscribe({
        next: (data: any) => {
          // console.log("Operation : ", data);
          this.fusionTab = data[0]
          let solde = 0
          this.fusionTab.forEach((op: any) => {
            // console.log("Echo : ", op)
            if (op.type_operation == 'credit') {
              // fixing
              solde += parseFloat(op.montant)
              // op['solde'] = amount;
            }
            if (op.type_operation == 'debit') {
              //caisse
              solde -= parseFloat(op.montant)
            }
            op['solde'] = solde
          })
          this.SoldeUSD = solde
          // console.log("FUSION : ", this.fusionTab);
        },
        error: (err: any) => console.log(err)
      })
  }

  imprimerDiv (): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }

  imprimerDiv_ (): void {
    imprimerDiv(this.divToPrint_.nativeElement.innerHTML)
  }
}
