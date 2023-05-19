import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { OperationsService } from '../../operations.service';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-list-fixing',
  templateUrl: './list-fixing.component.html',
  styleUrls: ['./list-fixing.component.css']
})



export class ListFixingComponent implements OnInit, AfterViewInit {

  @ViewChild(MatSort) sort?: MatSort | any;
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
  displaysColums: string[] = ["select", "date", "reference", "fournisseur", "fixing", "discounte", "p_unit", "pds_fixe", "pds_vendu", "pds_restant"];
  selection = new SelectionModel<any>(true, []);


  title = 'List fixing'

  ngOnInit(): void {
    this.getAllFixing()
  }

   /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;

  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
