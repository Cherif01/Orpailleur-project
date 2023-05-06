import { ChangeDetectionStrategy, Input } from '@angular/core';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiserviceService } from '../../api_service/apiservice.service'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-list-fournisseur',
  templateUrl: './list-fournisseur.component.html',
  styleUrls: ['./list-fournisseur.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class ListFournisseurComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private service: ApiserviceService,
    public location: Location
  ) {

    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  title = "fournisseur"
  listFournisseur: any;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["nom", "prenom", "pays", "ville", "adresse", "tel", "mail", "action"];

  ngOnInit() {
    // Datatables
    this.getFournisseur()
  }

  // GET Fournisseur
  getFournisseur() {
    this.service.getFournisseur().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        // console.log(data)
      }
    })
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }


}
