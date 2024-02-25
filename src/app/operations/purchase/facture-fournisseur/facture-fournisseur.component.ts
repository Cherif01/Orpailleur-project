import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { PurchaseService } from '../purchase.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

@Component({
  selector: 'app-facture-fournisseur',
  templateUrl: './facture-fournisseur.component.html',
  styleUrls: ['./facture-fournisseur.component.css']
})
export class FactureFournisseurComponent implements OnInit {

  constructor(
    private serviceOperation: PurchaseService,
    private service: ApiserviceService,
    private activeroute: ActivatedRoute,
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  listFournisseur: any;
  title = 'Facture Fournisseur'

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns = ["fournisseur", "pays", "ville", "adresse", "tel", "action"];
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
    this.service.LIST('public', 'read.php', 'table_fournisseur').subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        // console.log(data)
      }
    })
  }

  // GET FIxing
  TabFixing: any = []
  TabFixingValider: any = []
  name: string = ""

  ID_fournisseur: any
  Name_fournisseur: any = ''
  Adresse_fournisseur: any

  // Tous les fixing en cours d'un fournisseur

  getAllFixing() {
    this.service.getUnique('fixing', 'fixinglive.php', this.ID_F)
      .subscribe({
        next: (data: any[]) => {
          console.log("Res : ", data)
          data.forEach((item: any, index: number) => {
            this.name = item.nomComplet
            if(item.statut_fixing == 1){
              this.TabFixing.push(item);
            }else if(item.statut_fixing == 2){
              this.TabFixingValider.push(item);
            }

          })
          // console.log("Tab : ", this.TabFixing);
        },
        error: (err: any) => console.log(err)
      })


  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
