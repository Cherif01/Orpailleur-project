import { Component, OnInit, ViewChild } from '@angular/core';
import { VendorServiceService } from '../../vendor-service.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

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
    public location: Location,
    private service: ApiserviceService
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  upDown = true
  title = "Facture Achat";
  items: any[] = []
  dataAchat: any[] = []
  displaysColums = ["created_at", "Arrivage", "fournisseur", "Poids", "Carrat", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  IDFournisseur: any

  ngOnInit(): void {
    // ID Fournisseur EN GET
    this.IDFournisseur = this.activeroute.snapshot.params['id'];

    this.getAllAchat()
  }


  getAllAchat() {
    this.service.getUnique('fixing', 'listAchat.php', this.IDFournisseur)
      .subscribe({
        next: (data: any) => {
          // console.log("List Achat : ", data);
          this.dataSource.data = data
        },
        error: (err: any) => console.log(err)
      })

  }

  // LIST ACHAT
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }
}
