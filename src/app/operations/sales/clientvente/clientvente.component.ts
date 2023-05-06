import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { OperationsService } from '../../operations.service';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LINK_BASE } from 'src/app/config';

@Component({
  selector: 'app-clientvente',
  templateUrl: './clientvente.component.html',
  styleUrls: ['./clientvente.component.css']
})
export class ClientventeComponent implements OnInit {
  listFournisseurAchat: any
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();
  title = "Client choice"

  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private Operationservice: OperationsService,
    private fb: FormBuilder
    ) {
    this.search.valueChanges.subscribe((v: string) => {
      this.filterTable(v)

    })
  }

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = ["responsable", "raison_sociale", "pays", "ville", "adresse", "tel", "mail", "action"];

  ID_fournisseur: any = 0

  ngOnInit(): void {
    this.ID_fournisseur = this.activeroute.snapshot.params['id'];
    this.getClientVente()
  }

  // GET Client
  getClientVente() {
    this.Operationservice.getList('client_api', 'client').subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      }
    })
  }

  // Filtre search
  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
