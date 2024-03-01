import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { MatPaginator } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Location } from '@angular/common'
import { MatTableDataSource } from '@angular/material/table'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { RapportService } from 'src/app/rapport.service'
import { ActivatedRoute, Router } from '@angular/router'
import { format2Chart, imprimerDiv } from 'src/app/app.component'

@Component({
  selector: 'app-rapport-fournisseur',
  templateUrl: './rapport-fournisseur.component.html',
  styleUrls: ['./rapport-fournisseur.component.css']
})
export class RapportFournisseurComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null)
  search = new FormControl()

  @ViewChild('divToPrint') divToPrint: ElementRef | any
  @ViewChild('head') head: ElementRef | any

  constructor (
    private service: ApiserviceService,
    private activeRoute: ActivatedRoute,
    public location: Location,
    private router: Router
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  title = 'Rapport'
  listFournisseur: any
  clickEvent: any = false
  idFournisseur: any

  dataSource: MatTableDataSource<any> = new MatTableDataSource()
  displaysColums = ['Nom-complet', 'pays', 'ville', 'adresse', 'tel', 'action']

  displayedColumns2 = [
    'Date',
    'Arrivage',
    'Fournisseur',
    'Poids_total',
    'Carrat_moyen'
  ]
  dataSource2: MatTableDataSource<any> = new MatTableDataSource()

  ngOnInit () {
    // Datatables
    this.getFournisseur()
    this.idFournisseur = this.activeRoute.snapshot.params['id']
  }

  // GET Fournisseur
  getFournisseur () {
    this.service.LIST('public', 'read.php', 'table_fournisseur').subscribe({
      next: data => {
        this.dataSource.data = data
        this.dataSource.paginator = this.paginator
        // console.log(data)
      }
    })
  }

  // Event Rapport
  Name: any
  fusionTab: any[] = []
  SoldeGNF: number = 0
  SoldeUSD: number = 0
  // ITEM
  ListItem: any = []
  PoidsTotal_barre: number = 0
  manquantTotal: number = 0
  CMoyen: number = 0
  goRapport (nomClomplet: string, id: number): any {
    this.clickEvent = true
    this.Name = nomClomplet
    this.router.navigate(['/rapport/rapport-frs/', id])
    this.service.getUnique('fournisseur', 'operation.php', id).subscribe({
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
        this.SoldeUSD = format2Chart(solde)
        // console.log("FUSION : ", this.fusionTab);

        // CONVOIE
        this.service
          .LIST_BY_ID('rapport', 'fournisseur/convoie.php', id.toString())
          .subscribe({
            next: (data: any) => {
              // console.log("Data : ", data);
              this.dataSource2.data = data
            }
          })

        // Item
        this.service
          .LIST_BY_ID('rapport', 'fournisseur/getItembydate.php', id.toString())
          .subscribe({
            next: (data: any) => {
              // console.log("Data : ", data);
              data[0].forEach((item: any) => {
                this.ListItem.push(item)
              })
              this.PoidsTotal_barre += data[1]
              this.CMoyen += format2Chart(data[2] / data[1])
              this.manquantTotal += data[3]
            }
          })
      },
      error: (err: any) => console.log(err)
    })
  }

  filterTable (value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase()
  }

  rechercheIntervalleForm = new FormGroup({
    dateStart: new FormControl<any>(null),
    dateEnd: new FormControl<any>(null)
  })
  // Intervalle
  startDate: any
  endDate: any
  // RAPPORT PERSONNALISER
  rapportPersonnaliser (formSearch: any) {
    // let Date1: any = new Date(formSearch.value.dateStart)
    // let Date2: any = new Date(formSearch.value.dateEnd)
    // this.startDate = Date1.toLocaleDateString()
    // this.endDate = Date2.toLocaleDateString()
    // console.log("Date : ", this.startDate, this.endDate);
    // this.service.LIST_ALL_PRECIS('rapport', 'getItembydate.php')
    //   .subscribe({
    //     next: (data: any) => {
    //       console.log("Data_filter : ", data);
    //     }
    //   })
  }

  imprimerDiv (): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }
}
