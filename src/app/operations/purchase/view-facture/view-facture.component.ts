import { SelectionModel } from '@angular/cdk/collections'
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, Validators, FormBuilder, FormGroup } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute } from '@angular/router'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { imprimerDiv, generatePDF } from 'src/app/app.component'
import { PurchaseService } from '../purchase.service'
import { Location } from '@angular/common'

@Component({
  selector: 'app-view-facture',
  templateUrl: './view-facture.component.html',
  styleUrls: ['./view-facture.component.css']
})
export class ViewFactureComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any
  @ViewChild('head') head: ElementRef | any
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null)
  search = new FormControl()

  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  displayedColumns: string[] = [
    'select',
    'id',
    'Date',
    'Fournisseur',
    'Poids_total',
    'Fixing',
    'P_Fixing',
    'Poids_restant',
    'Poids vendu',
    'Action'
  ]
  selection = new SelectionModel<any>(true, [])

  title = 'Facture vente'

  constructor (
    private service: ApiserviceService,
    private activeroute: ActivatedRoute,
    public location: Location
  ) {}

  idFixing: string = ''
  ngOnInit () {
    // ID FIXING
    this.idFixing = this.activeroute.snapshot.params['id']
    // LIST
    this.factureElement()
  }

  dataItemOneFacture: any[] = []
  dataItemOneFacturePoids: any[] = []

  MontantFacture: number = 0
  mManquant: number = 0
  MontantFacturePoids: number = 0
  differenceFP: number = 0
  poids_total: number = 0
  carra_moyen: number = 0
  pu: number = 0
  bourse: number = 0
  fournisseur: string = ''
  fournisseurTel: string = ''
  created_at_in_facture: any
  idF: any
  code_facture: any
  factureElement () {
    // console.log('ID Fixing : ', this.idFixing)
    this.service
      .getUnique('facturevente', 'facture.php', parseInt(this.idFixing))
      .subscribe({
        next: (data: any) => {
          this.idF = data[0].idFournisseur
          this.fournisseur = data[0].fournisseur
          this.fournisseurTel = data[0].fournisseurTel
          this.bourse = data[0].bourse
          this.code_facture = data[0].NumeroF
          console.log('RES : ', data)
          this.getCompteFournisseur(this.idF)
          if (data[0].state == false) {
            this.dataItemOneFacturePoids.push(data[0])
            this.created_at_in_facture = data[0].created_at_in_facture
            this.bourse = data[0].bourse
            let pu = this.format2Chart(data[0].bourse / 34 - data[0].discount)
            let poids = parseFloat(data[0].poids)
            let carrat = parseFloat(data[0].carrat)
            this.MontantFacturePoids = parseFloat(
              this.calculPrice(pu, poids, carrat)
            )
            this.mManquant = parseFloat(
              this.calculPrice(pu, poids, data[0].carrat_manquant)
            )
            this.poids_total = poids
            this.carra_moyen = (carrat)
            this.pu = pu
            this.code_facture = data[0].NumeroF
          } else {
            data.forEach((item: any) => {
              this.dataItemOneFacture.push(item)
              this.created_at_in_facture = data[0].created_at_in_facture
              let pu = this.format2Chart(item.bourse / 34 - item.discount)
              let poids = parseFloat(item.poids)
              let carrat = parseFloat(item.carrat)
              let m = this.calculPrice(pu, poids, carrat)
              this.MontantFacture += parseFloat(m)
              // Difference
              let mq = this.calculPrice(pu, poids, item.manquant)
              this.mManquant += parseFloat(mq)

              this.poids_total += poids
              this.carra_moyen += poids * carrat
              this.pu = pu
            })
            this.carra_moyen = (this.carra_moyen/this.poids_total)
          }
        },
        error: (err: any) => console.log(err)
      })
  }

  // GET COMPTE Fournisseur
  SoldeUSD: number = 0
  SoldeGNF: number = 0
  getCompteFournisseur (id: any) {
    if (id) {
      this.service
        .getUnique('fournisseur', 'operation.php', parseInt(id))
        .subscribe({
          next: (data: any) => {
            // console.log("REs : ", data);
            let solde: number = 0
            data[0].forEach((op: any) => {
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
          },
          error: (err: any) => console.log(err)
        })
    }
  }

  //
  Total: number = 0
  calculPrice (pu: any, poids: any, carrat: any) {
    let Montant: any = (pu / 22) * poids * carrat
    this.Total += Montant
    return Montant
  }

  format2Chart (data: any) {
    let tab = data.toString().split('.')
    if (tab.length < 2) return Number(data)
    return Number(tab[0].concat('.', tab[1].substr(0, 2)))
  }

  imprimerDiv (): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }

  backList (): void {
    window.location.reload()
  }

  generatePDF (nameFournisseur?: string) {
    generatePDF(nameFournisseur)
  }
}
