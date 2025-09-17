import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';
import { LotService } from 'src/app/lot/lot.service';

@Component({
  selector: 'app-init-expedition',
  templateUrl: './init-expedition.component.html',
  styleUrls: ['./init-expedition.component.css'],
})
export class InitExpeditionComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();
  selection = new SelectionModel<any>(true, []);

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums = [
    'Date',
    'Client',
    'Poids',
    'CarratMoyen',
    'Status',
    'Action',
  ];

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  formInit = new FormGroup({
    idClient: new FormControl('', [Validators.required]),
  });

  constructor(
    private serviceLot: LotService,
    private snackBar: MatSnackBar,
    private service: ApiserviceService,
    public location: Location
  ) {}

  title = "Bienvenu dans l'expedition";
  ngOnInit(): void {
    this.getCusters();
    this.getExpeditionOnline();
    this.getListExpedition();
  }

  // Liste des clients
  statExpedition: boolean = false;
  infoCL: any = {};
  idExpedtion: string = '';
  TabItems_added: any = [];
  getExpeditionOnline(): void {
    this.service.getList('client', 'verifExpedition.php').subscribe({
      next: (response: any) => {
        // console.log('Expedition - ', response);
        if (response.info.etat == true) {
          this.idExpedtion = response.info.idExpedition;
          this.statExpedition = response.info.etat;
          this.infoCL = response.info;
          this.TabItems_added = response.items;
        }
      },
      error: (err: any) => {
        console.log('Error - ', err);
      },
    });
  }

  // LIST EXPEDITION
  datatable: any[] = [];
  getListExpedition(): void {
    this.service.getList('client', 'getExpedition.php').subscribe({
      next: (data: any) => {
        // console.log("Data : ", data);
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
      },
    });
  }

  // Add items
  formAddItems = new FormGroup({
    id_initExpedition: new FormControl(),
    poids: new FormControl('', [Validators.required]),
    carrat: new FormControl('', [Validators.required]),
  });

  addItems() {
    // console.log(this.idExpedtion);
    this.formAddItems.value.id_initExpedition = this.idExpedtion;
    this.service
      .create(
        'client',
        'addItem_expedition.php',
        convertObjectInFormData(this.formAddItems.value)
      )
      .subscribe({
        next: (response: any) => {
          if (response.status == 1) {
            this.snackBar.open(response.message, 'Okay', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: ['bg-success', 'text-white'],
            });
            this.getExpeditionOnline();
            this.getListExpedition();
            this.formAddItems.patchValue({
              poids: ' ',
              carrat: ' ',
            });
          } else {
            this.snackBar.open(response.message, 'Okay', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'bottom',
              panelClass: ['bg-danger', 'text-white'],
            });
          }
        },
      });
  }

  // SUPPRIMER UNE EXPEDITION EN COURS
  deleteExpedtion() {
    // console.log('delete : ', form.value);
    this.service.sendID('client', 'deleteExp.php', this.idExpedtion).subscribe({
      next: (data: any) => {
        window.location.reload();
        // console.log("Data : ", data);
      },
      error: (err: any) => {
        console.log('Error - ', err);
      },
    });
  }

  // SUPPRIMER UNE EXPEDITION EN COURS
  deleteLine(idElement: any) {
    // console.log('delete : ', idElement);
    this.service.sendID('client', 'deleteItemExp.php', idElement).subscribe({
      next: (response: any) => {
        if (response.status == 1) {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['bg-success', 'text-white'],
          });
          this.getExpeditionOnline();
          this.getListExpedition();
          this.formAddItems.patchValue({
            poids: ' ',
            carrat: ' ',
          });
        } else {
          this.snackBar.open(response.message, 'Okay', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['bg-danger', 'text-white'],
          });
        }
      },
      error: (err: any) => {
        console.log('Error - ', err);
      },
    });
  }

  // VALIDER ET TERMINER UNE EXPEDITION
  endExpedtion() {
    // console.log('teminer : ', this.idExpedtion);
    this.service.sendID('client', 'endExp.php', this.idExpedtion).subscribe({
      next: (data: any) => {
        // console.log("Data : ", data);
        window.location.reload();
      },
    });
  }

  // Liste des clients
  TabClient: any[] = [];
  getCusters(): void {
    this.service.LIST('public', 'read.php', 'table_client').subscribe({
      next: (client: any) => {
        client.forEach((c: any) => {
          this.TabClient.push(c);
        });
      },
    });
  }

  initExpedition(form: FormGroup) {
    // console.log('Form : ', form.value)
    const f = convertObjectInFormData(form.value);
    this.service.create('client', 'initExpedition.php', f).subscribe({
      next: (response: any) => {
        // console.log('RES : ', response)
        this.snackBar.open(response, 'Okay', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['bg-success', 'text-white'],
        });
        window.location.reload();
      },
      error: (err: any) => {
        console.log('ERR : ', err);
      },
    });
  }
}
