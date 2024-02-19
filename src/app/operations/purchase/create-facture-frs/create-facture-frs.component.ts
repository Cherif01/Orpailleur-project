import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../purchase.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { generatePDF, imprimerDiv } from 'src/app/app.component';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-create-facture-frs',
  templateUrl: './create-facture-frs.component.html',
  styleUrls: ['./create-facture-frs.component.css']
})

export class CreateFactureFrsComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: string[] = ["Date", "Fournisseur", "Poids_total", "Fixing", "P_Fixing", "Poids_restant", "Poids vendu", "Action"];
  // selection = new SelectionModel<any>(true, []);

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
    private service: ApiserviceService,
    private activeroute: ActivatedRoute,
    public location: Location,
    private fb: FormBuilder
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }


  ngOnInit() {
    // ID Fournisseur EN GET
    this.idGet = this.activeroute.snapshot.params['id'];
    // LIST
    this.detailFixing()
    // this.getCompteFournisseur()
  }

  // Reset form
  resetForm(form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      form.controls[field].setValue(null);
      form.controls[field].updateValueAndValidity();
    })
  }


  // InfoFixing
  infoFixing: any = {}
  tableFacture: any[] = []
  tableFacture2: any[] = []
  dataTable: any[] = []
  codec: any = null
  detailFixing() {
    this.service.LIST_ALL_PRECIS('facturevente', 'readItemFacture.php')
      .subscribe({
        next: ((data) => {
          // console.log("Detail : ", data);
          data[0].forEach((elem: any) => {
            this.infoFixing = elem
            this.tableFacture.push(elem)
          })

          this.service.LIST_ALL_PRECIS('facturevente', 'readPoidsFacture.php')
            .subscribe({
              next: ((dataPoids) => {
                // console.log("in poids : ", dataPoids[0]);
                this.tableFacture2 = dataPoids[0]
                this.dataSource.data = [...this.tableFacture, ...this.tableFacture2]
                this.dataSource.paginator = this.paginator;
                // console.log(this.dataSource.data);
              })
            })

        }),
        error: (err) => console.log("error : ", err)
      })

  }


  //
  Total: number = 0
  calculPrice(pu: any, poids: any, carrat: any) {
    let Montant: any = ((pu / 22) * poids * carrat)
    this.Total += Montant
    return Montant
  }

  format2Chart(data: any) {
    let tab = data.toString().split(".");
    if (tab.length < 2)
      return Number(data);
    return Number(tab[0].concat('.', tab[1].substr(0, 2)));
  }

  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }


  generatePDF(nameFournisseur?: string) {
    generatePDF(nameFournisseur);
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }


}
