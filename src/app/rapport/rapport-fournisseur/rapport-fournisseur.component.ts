import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { RapportService } from 'src/app/rapport.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rapport-fournisseur',
  templateUrl: './rapport-fournisseur.component.html',
  styleUrls: ['./rapport-fournisseur.component.css']
})
export class RapportFournisseurComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private service: ApiserviceService,
    private serviceRapport: RapportService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private snackBar: MatSnackBar,
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  title = "Rapport"
  listFournisseur: any;
  clickEvent: any = false
  idFournisseur: any

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["nom", "prenom", "pays", "ville", "adresse", "tel", "action"];

  ngOnInit() {
    // Datatables
    this.getFournisseur()
    this.idFournisseur = this.activeRoute.snapshot.params['id']
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

  // Event Rapport
  Name: any
  goRapport(name: any, surname: any, id: number): any {
    this.clickEvent = true
    this.Name = name +' '+surname;
    // this.router.navigate(['/rapport/rapport-frs/', id])

  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
