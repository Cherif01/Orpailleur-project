import { Component, OnInit, ViewChild } from '@angular/core';
import { VendorServiceService } from '../../vendor-service.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

@Component({
  selector: 'app-factureachat',
  templateUrl: './factureachat.component.html',
  styleUrls: ['./factureachat.component.css']
})
export class FactureachatComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private serviceVendor: VendorServiceService,
    private activeroute: ActivatedRoute,
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  upDown = true
  title = "Facture Achat";
  items: any[] = []
  dataAchat: any[] = []
  displaysColums = ["created_at", "slug", "fournisseur", "adresse", "telephone", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  IDFournisseur: any

  ngOnInit(): void {
    // ID Fournisseur EN GET
    this.IDFournisseur = this.activeroute.snapshot.params['id'];

    this.getAllAchat()
  }


  getAllAchat() {
    this.serviceVendor.getList('api', 'achat').subscribe({
      next: (data) => {
        let result: any[] = [];
        data.forEach((item, index) => {
          if(item.fournisseur.id == this.IDFournisseur && item.status == 2){
            result.push({
              id: item.id,
              date_achat: item.created_at,
              slug: item.slug,
              fournisseur: item.fournisseur,
            });
          }
        });
        this.dataSource.data = result
        return result;
      }
    })
  }


  // LIST ACHAT
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }
}
