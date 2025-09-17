import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateRange, MatDateRangePicker } from '@angular/material/datepicker';
import moment from 'moment';

import { ReplaySubject, Subject } from 'rxjs';
import { SelectFilterService } from 'src/app/services/select-filter.service';
import { Location } from '@angular/common';
import { PurchaseService } from 'src/app/operations/purchase/purchase.service';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  rangeFormGroup = new FormGroup({
    start: new FormControl<any>(null),
    end: new FormControl<any>(null),
  });

  public searchFilterVendorCtrl: FormControl = new FormControl();
  public FilterVendor: any = new ReplaySubject(1);
  vendors: any;

  selectedDateRange: DateRange<Date> | undefined;
  q: MatDateRangePicker<Date> | undefined;
  selectDateType: any;

  protected _onDestroy = new Subject();
  start: any;
  selectedDateCalendar: any;
  ends: any;
  matButtonControle: any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  constructor(
    private selectFilter: SelectFilterService,
    private purchaseService: PurchaseService,
    private service: ApiserviceService,
    public location: Location
  ) {
    this.search.valueChanges.subscribe((v) => {
      this.filterTable(v);
    });
  }

  nameSession: any = localStorage.getItem('nomComplet');
  roleSession: any = localStorage.getItem('role');

  upDown = true;
  title = 'Achat';
  items: any[] = [];
  dataAchat: any[] = [];
  displaysColums = ['fournisseur', 'poids_total', 'carrat_achat', 'action'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  _ACCESS_BUTTON_ROLE = 'Administrateur';
  _ROLE_ = localStorage.getItem('role');
  Access__ = false;

  daysLeft = 365;
  private decrementInterval: any;

  texts: string[] = [
    "Bienvenue sur notre application d'achat et de vente d'or...",
    "Achat et vente d'or en temps réel : Suivez les cours de l'or et réalisez vos transactions en quelques clics.",
    "Une comptabilité intégrée : Suivez vos gains, vos investissements et l'évolution de votre portefeuille grâce à des outils d'analyse détaillés.",
    'Sécurité et transparence : Chaque transaction est cryptée et enregistrée pour garantir une fiabilité maximale.',
    "Notifications instantanées : Recevez des alertes sur les variations de prix et ne manquez jamais une opportunité d'investissement.",
    'Interface intuitive et ergonomique : Conçue pour une navigation fluide, même pour les débutants.',
    'Notre mission est simple : vous offrir une plateforme moderne, fiable et performante pour gérer votre or en toute sérénité.',
    'Ne laissez plus passer les meilleures opportunités ! Rejoignez-nous dès aujourd’hui et entrez dans une nouvelle ère du commerce d’or digitalisé avec la nouvelle technology.',
  ];
  currentText: string = this.texts[0];
  isFading: boolean = false;
  index: number = 0;

  ngOnInit(): void {
    this.getPurchaseListe();
    this.testROLE();
    setInterval(() => {
      this.dashboard();
      this.getPurchaseListe();
    }, 5000);

    this.updateTimer();
    this.decrementInterval = setInterval(() => this.decrementDays(), 86400000); // 24 heures

    // Text animated
    setInterval(() => {
      this.isFading = true;
      setTimeout(() => {
        this.index = (this.index + 1) % this.texts.length;
        this.currentText = this.texts[this.index];
        this.isFading = false;
      }, 800);
    }, 3000);
  }

  updateTimer(): void {
    // La logique pour mettre à jour l'affichage peut être plus complexe si nécessaire
  }

  decrementDays(): void {
    if (this.daysLeft > 0) {
      this.daysLeft -= 1;
    } else {
      clearInterval(this.decrementInterval); // Arrêter le chronomètre lorsque le compte atteint 0
      alert('Le chronomètre est terminé');
    }
  }

  testROLE() {
    if (this._ACCESS_BUTTON_ROLE == this._ROLE_) {
      this.Access__ = true;
    } else {
      this.Access__ = false;
    }
  }

  // LIST ACHAT

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

  _onSelectedChange(date: Date): void {
    this.matButtonControle = undefined;
    if (
      this.selectedDateRange &&
      this.selectedDateRange.start &&
      date > this.selectedDateRange.start &&
      !this.selectedDateRange.end
    ) {
      this.selectedDateRange = new DateRange(
        this.selectedDateRange.start,
        date
      );
    } else {
      this.selectedDateRange = new DateRange(date, null);
    }
  }

  matGroupButtonChange(value: any) {
    this.matButtonControle = undefined;
    if (value == 0) {
      this.selectedDateRange = new DateRange(new Date(), new Date());
    } else if (value == 1) {
      this.selectedDateRange = new DateRange(
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1))
      );
    } else if (value == 7) {
      this.selectedDateRange = new DateRange(
        new Date(new Date().setDate(new Date().getDate() - 7)),
        new Date(new Date().setDate(new Date().getDate() - 1))
      );
    } else if (value == 30) {
      this.selectedDateRange = new DateRange(
        new Date(new Date().setDate(new Date().getDate() - 30)),
        new Date(new Date().setDate(new Date().getDate() - 1))
      );
    } else if (value === 'currentMonth') {
      this.selectedDateRange = new DateRange(
        new Date(new Date().setDate(1)),
        new Date(new Date().setDate(new Date().getDate()))
      );
    } else {
      let lastMonth = new Date().getMonth();
      let year: any;
      if (lastMonth == 0) {
        lastMonth = 11;
        year = new Date(
          new Date(new Date().setMonth(lastMonth)).setFullYear(
            new Date().getFullYear() - 1
          )
        ).getFullYear();
      } else {
        lastMonth--;
        year = new Date(new Date().setMonth(lastMonth)).getFullYear();
      }
      let endValueDate = [0, 2, 4, 6, 7, 9, 11].includes(lastMonth)
        ? 31
        : [1].includes(lastMonth)
        ? year % 4 == 0
          ? 29
          : 28
        : 30;
      let endDate = new Date(
        new Date(
          new Date(new Date().setMonth(lastMonth)).setDate(endValueDate)
        ).setFullYear(year)
      );
      let startDate = new Date(
        new Date(
          new Date(new Date().setMonth(lastMonth)).setDate(1)
        ).setFullYear(year)
      );
      this.selectedDateRange = new DateRange(startDate, endDate);
    }
  }
  appliqueRange() {
    this.rangeFormGroup.get('start')?.setValue(this.selectedDateRange?.start);
    this.rangeFormGroup.get('end')?.setValue(this.selectedDateRange?.end);
    this.getPurchaseListe();
  }
  toggleStartDateDate(date: any, calendar: any) {
    const selected_date = moment(date).toDate();
    if (this.selectDateType === 'startDateAfter') {
      this.start = selected_date;
      this.ends = selected_date;
      this.selectDateType = 'startDateBefore';
    } else {
      if (moment(date).isBefore(moment(this.start))) {
        this.start = selected_date;
        this.ends = selected_date;
        this.selectDateType = 'startDateBefore';
      } else {
        this.ends = selected_date;
        this.selectDateType = 'startDateAfter';
      }
    }
    this.selectedDateCalendar = new DateRange(
      moment(this.start),
      moment(this.ends)
    );
    calendar.updateTodaysDate();
  }

  reset() {
    this.rangeFormGroup.reset();
    this.selectedDateRange = new DateRange(new Date(), null);
    this.matButtonControle = null;
    this.dataSource.data = this.items = [];
    this.onSubscribePurchage?.unsubscribe();
  }

  getVendor(items: any[]) {
    this.vendors = items.map((val) => val.fournisseur);
    // console.log(this.vendors);
    this.FilterVendor.next(this.vendors);
    this.searchFilterVendorCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.FilterVendor.next(
          this.selectFilter.filterMethodWithFirstNameAndLastName(
            this.vendors,
            this.searchFilterVendorCtrl.value
          )
        );
      });
  }

  onSubscribePurchage: any;
  getPurchaseListe() {
    this.purchaseService
      .LISTFournisseurAchat('dashboard', 'achatdujour.php')
      .subscribe((data) => {
        // console.log("Achat : ", data);
        this.dataSource.data = data;
      });
  }

  filterVendor(vendorId: any) {
    if (vendorId != -1)
      this.dataSource.data = this.items.filter(
        (data) => data.fournisseur?.id == vendorId
      );
    else this.dataSource.data = this.items;
  }

  // DETAILS (STATISTIQUE DASHBOARD)
  caisse: any = {};
  aujourdhui: Date = new Date();

  nbFournisseur = 0;
  nbClient = 0;
  nbAchatToday = 0;
  TotalPoidsToday = 0;
  poidsFixer = 0;
  moyenneBourse = 0;
  dashboard(): void {
    // DAYS
    this.service.getList_('dashboard', 'statistique.php').subscribe({
      next: (data: any) => {
        // console.log("data " , data);
        this.nbFournisseur = data.nbFournisseur;
        this.nbClient = data.nbClient;
        this.nbAchatToday = data.nbAchatToday;
        this.TotalPoidsToday = data.TotalPoidsToday;
      },
    });

    // LOT

    // ACHAT

    // FIXING
    this.service.getList_('dashboard', 'fixingtoday.php').subscribe({
      next: (data: any) => {
        // console.log("data ", data);
        this.poidsFixer = data.poidsFixer;
        this.moyenneBourse = data.moyenneBourse;
      },
    });

    // CAISSE
    this.service.getList_('caisse', 'filter_.php').subscribe({
      next: (data: any) => {
        // console.log("data ", data);
        this.caisse = data;
      },
    });
  }
  // END

  ngAfterViewInit() {
    this.createSecteurChart();
    this.createPolarChart();
  }

  createSecteurChart() {
    new Chart('secteurChart', {
      type: 'doughnut',
      data: {
        labels: ['Encaissement', 'Décaissement'],
        datasets: [
          {
            data: [this.caisse.EntrerUSD ?? 1, this.caisse.SortieUS ?? 1],
            backgroundColor: ['green', '#dc3545'], // Vert et Rouge
            hoverOffset: 10,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  createPolarChart() {
    new Chart('polarChart', {
      type: 'polarArea',
      data: {
        labels: ['Encaissement', 'Décaissement'],
        datasets: [
          {
            data: [this.caisse.EntrerUSD ?? 1, this.caisse.SortieUS ?? 1],
            backgroundColor: ['crimson', 'cyan'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }
}
