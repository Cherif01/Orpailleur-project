import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { PurchaseService } from '../purchase.service';

@Component({
  selector: 'app-fournisseurachat',
  templateUrl: './fournisseurachat.component.html',
  styleUrls: ['./fournisseurachat.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FournisseurachatComponent implements OnInit {

  title = 'Fournisseur-achat'
  listFournisseurAchat: any
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private purchaseService: PurchaseService,
    public location: Location,
    private router: Router
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)

    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["Nom-complet", "pays", "ville", "adresse", "tel", "mail", "action"];

  ID_fournisseur: any = 0

  ngOnInit(): void {
    this.ID_fournisseur = this.activeroute.snapshot.params['id'];
    this.getFournisseurAchat()
  }

  // GET Fournisseur
  getFournisseurAchat() {
    this.service.LIST('public', 'read.php', 'table_fournisseur').subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  sendID(id_fournisseur: any): void {
    if (id_fournisseur) {
      this.purchaseService.getOneById('fournisseur', 'getOne.php', id_fournisseur)
        .subscribe({
          next: (data => {
            console.log("Data : ", data);
            if (data != null) {
              // this.dataSource
              this.router.navigate([`/operation/add-purchase/${id_fournisseur}`])
            } else {
              this.router.navigate([`/operation/init-purchase/${id_fournisseur}`])
            }
          }),
          error: (error => {
            console.log(error);
          })
        })
    }
    // this.router.navigate([`/operation/add-purchase/${id_fournisseur}`])
  }

  // Filtre search
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
