import { ChangeDetectionStrategy, Input } from '@angular/core';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiserviceService } from '../../api_service/apiservice.service'
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { VendorServiceService } from '../vendor-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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
    private service_vendor: VendorServiceService,
    private snackBar: MatSnackBar,
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  title = "fournisseur"
  listFournisseur: any;

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["nom", "prenom", "pays", "ville", "adresse", "tel", "action"];

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


  oldValueNom: any;
  oldValuePrenom: any;
  oldValuePays: any;
  oldValueVille: any;
  oldValueAdresse: any;
  oldValueTelephone: any;
  newRowsUpdate: any = [];

  setOldValues(row: any) {
    this.newRowsUpdate = row;
  }

  updateDirectRow(row: any) {
    // console.log("row : ", row);
    if (row == this.newRowsUpdate) {
      this.saveTableData(row);
    }
  }

  saveTableData(element: any) {
    // console.log("ID : ", index);
    // console.log("Row : ", element);
    this.service_vendor.updateRows(element)
      .subscribe({
        next: (response) => {
          this.snackBar.open("Mise à jour effctuée avec succès!", undefined, {
            duration: 2000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: ['bg-success', 'text-white']

          });
        },
        error: (err) => {
          this.snackBar.open("Echec, Veuillez reessayer!", undefined, {
            duration: 1000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })

    // Traitez les données modifiées ici
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }


}
