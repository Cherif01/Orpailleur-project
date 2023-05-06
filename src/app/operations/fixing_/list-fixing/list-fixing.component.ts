import { Component, OnInit, ViewChild } from '@angular/core';
import { OperationsService } from '../../operations.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';

@Component({
  selector: 'app-list-fixing',
  templateUrl: './list-fixing.component.html',
  styleUrls: ['./list-fixing.component.css']
})
export class ListFixingComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private serviceOperation: OperationsService,
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["date", "reference", "fournisseur", "fixing", "discounte", "p_unit", "pds_fixe", "pds_vendu", "pds_restant"];


  title = 'List fixing'

  ngOnInit(): void {
    this.getAllFixing()
  }


  // GET FIxing
  TabFixing: any = []
  getAllFixing() {
    this.serviceOperation.getList('api', 'fixing').subscribe({
      next: (data: any) => {
        // console.log(data),
        // this.TabFixing = data;
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => console.log(err)
    })

  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
