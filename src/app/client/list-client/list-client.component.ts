import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiserviceService } from '../../api_service/apiservice.service'
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddClientComponent } from 'src/app/public/dialogs/dialog-add-client/dialog-add-client.component';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-list-client',
  templateUrl: './list-client.component.html',
  styleUrls: ['./list-client.component.css']
})
export class ListClientComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private service: ApiserviceService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["responsable", "raison_sociale", "pays", "ville", "adresse", "tel", "mail", "action"];
  title = 'List client'

  ngOnInit() {
    // DataTable
    this.getClient()
  }

  // GET Client
  getClient() {
    this.service.getList('client_api', 'client').subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      }
    })
  }


  openDialog() {
    this.dialog.open(DialogAddClientComponent, {
    }).afterClosed()
      .subscribe((result) => {
        if (result?.event && result.event === "insert") {
          console.log(result.data);
          //Envoyer dans la Base
          this.service.clientPost(result.data).subscribe({
            next: (response) => {
              this.snackBar.open("Client enregistre avec succès !", "Okay", {
                duration: 3000,
                horizontalPosition: "right",
                verticalPosition: "top",
                panelClass: ['bg-success', 'text-white']

              })
            },
            error: (err) => {
              this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
                duration: 3000,
                horizontalPosition: "left",
                verticalPosition: "top",
                panelClass: ['bg-danger', 'text-white']
              })
            }
          })
        }
      })
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
