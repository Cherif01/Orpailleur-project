import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseService } from '../purchase.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-facture-fournisseur',
  templateUrl: './facture-fournisseur.component.html',
  styleUrls: ['./facture-fournisseur.component.css']
})
export class FactureFournisseurComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private serviceOperation: PurchaseService,
    private activeroute: ActivatedRoute,
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  listFournisseur: any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["nom", "prenom", "pays", "ville", "adresse", "tel", "mail", "action"];
  title = 'Facture Fournisseur'
  ID_F: any

  ngOnInit() {
    // ID Fournisseur EN GET
    this.ID_F = this.activeroute.snapshot.params['id'];

    // Datatables
    this.getFournisseur()
    //
    this.getAllFixing()
  }

  // GET Fournisseur
  getFournisseur() {
    this.serviceOperation.getList('api', 'fournisseur').subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        // console.log(data)
      }
    })
  }

  // GET FIxing
  TabFixing: any = []
  name: string = ""

  ID_fournisseur: any
  Name_fournisseur: any = ''
  Adresse_fournisseur: any

  getAllFixing() {
    this.serviceOperation.getList('api', 'fixing').subscribe({
      next: (data: any) => {
        // console.log(data),
        data.forEach((item: any, index: number) => {
          if (item.fournisseur.id == this.ID_F) {
            this.TabFixing.push(data[index]);
            this.name = item.fournisseur.prenom + " " + item.fournisseur.nom
            // console.log(this.TabFixing);
          }
        })
      },
      error: (err: any) => console.log(err)
    })


  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
