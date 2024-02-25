import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { error } from 'jquery';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { format2Chart, imprimerDiv } from 'src/app/app.component';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';

@Component({
  selector: 'app-rapport-achat',
  templateUrl: './rapport-achat.component.html',
  styleUrls: ['./rapport-achat.component.css']
})
export class RapportAchatComponent implements OnInit {

  displayedColumns = ['Date', 'Arrivage', 'Fournisseur', 'Poids_total', 'Carrat_moyen'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private router: Router,
    public location: Location,
  ) { }

  title = 'Rapport achat'


  ngOnInit(): void {
    this.getAchat_today()
    this.getItem_today()
  }

  // Achat du jour
  getAchat_today(): void {
    this.service.LIST_ALL_PRECIS('rapport', 'achat.php')
      .subscribe({
        next: (data: any) => {
          // console.log("Data : ", data);
          this.dataSource.data = data
        }
      })
  }

  // Item du jour
  ListItem: any = [];
  PoidsTotal_barre: number = 0;
  manquantTotal: number = 0;
  CMoyen: number = 0;
  getItem_today(): void {
    this.service.LIST_ALL_PRECIS('rapport', 'getItembydate.php')
      .subscribe({
        next: (data: any) => {
          // console.log("Data : ", data);
          this.startDate = new Date().toLocaleDateString()
          data[0].forEach((item: any) => {
            this.ListItem.push(item)
          })
          this.PoidsTotal_barre += data[1];
          this.CMoyen += format2Chart(data[2] / data[1]);
          this.manquantTotal += data[3];
        }
      })
  }


  rechercheIntervalleForm = new FormGroup({
    dateStart: new FormControl<any>(null),
    dateEnd: new FormControl<any>(null)
  })
  // Intervalle
  startDate: any
  endDate: any
  // RAPPORT PERSONNALISER
  rapportPersonnaliser(formSearch: any) {
    if (formSearch.value.dateStart == null)
      return
    // fin
    if (formSearch.value.dateEnd == null)
      formSearch.value.dateEnd = formSearch.value.dateStart
    // fin
    let Date1: any = new Date(formSearch.value.dateStart)
    let Date2: any = new Date(formSearch.value.dateEnd)
    this.startDate = Date1.toLocaleDateString()
    this.endDate = Date2.toLocaleDateString()
    // console.log("Date rapport : ", this.startDate, this.endDate);
    const formulaire = convertObjectInFormData(formSearch.value)
    // console.log("Form : ", formSearch.value);

    this.service.getIntervalle('rapport', 'getItembydate.php', formulaire)
      .subscribe({
        next: (data: any) => {
          console.log("Data_filter rapport : ", data);
          this.ListItem = [];
          this.PoidsTotal_barre = 0
          this.CMoyen = 0
          this.manquantTotal = 0
          // console.log("Data : ", data);
          data[0].forEach((item: any) => {
            this.ListItem.push(item)
          })
          this.PoidsTotal_barre += data[1];
          this.CMoyen += format2Chart(data[2] / data[1]);
          this.manquantTotal += data[3];
        },
        error: (error: any) => console.log("Error : ", error)
      })


  }

  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }


}
