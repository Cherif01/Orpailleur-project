import { Location } from '@angular/common';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    private fb: FormBuilder,
    public location: Location,
    private router: Router
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)

    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["nom", "prenom", "pays", "ville", "adresse", "tel", "mail", "action"];

  ID_fournisseur: any = 0

  ngOnInit(): void {
    this.ID_fournisseur = this.activeroute.snapshot.params['id'];
    this.getFournisseurAchat()
  }

  // GET Fournisseur
  getFournisseurAchat() {
    this.service.getFournisseur().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  sendID(id_fournisseur: any): void {
    if (id_fournisseur) {
      this.purchaseService.getPurchaseOnline(id_fournisseur)
        .subscribe({
          next: (data => {
            if(data.length > 0){
              console.log(data);
              // this.dataSource
              this.router.navigate([`/operation/add-purchase/${id_fournisseur}`])
            }else{
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
