import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateRange, MatDateRangePicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ReplaySubject, Subject } from 'rxjs';
import { SelectFilterService } from 'src/app/services/select-filter.service';
import { Location } from '@angular/common';
import { PurchaseService } from 'src/app/operations/purchase/purchase.service';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  rangeFormGroup = new FormGroup({
    start: new FormControl<any>(null),
    end: new FormControl<any>(null),
  });

  public searchFilterVendorCtrl: FormControl = new FormControl();
  public FilterVendor: any = new ReplaySubject(1);
  vendors: any

  selectedDateRange: DateRange<Date> | undefined;
  q: MatDateRangePicker<Date> | undefined
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
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  nameSession: any = localStorage.getItem('nomComplet')
  roleSession: any = localStorage.getItem('role')

  upDown = true
  title = "Achat";
  items: any[] = []
  dataAchat: any[] = []
  displaysColums = ["fournisseur", "poids_total", "carrat_achat", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  _ACCESS_BUTTON_ROLE = "Administrateur"
  _ROLE_ = localStorage.getItem('role')
  Access__ = false

  ngOnInit(): void {
    // console.log("Session : ", localStorage.getItem('session'));
    // console.log("Role : ", localStorage.getItem('role'));
    // console.log("State : ", localStorage.getItem('state'));
    // console.log("Username : ", localStorage.getItem('username'));
    // console.log("ROLE : ", this._ROLE_);
    this.getPurchaseListe();
    this.testROLE()
    setInterval(()=>{
      this.dashboard()
      this.getPurchaseListe()
    }, 5000)
  }

  testROLE(){
    if(this._ACCESS_BUTTON_ROLE == this._ROLE_){
      this.Access__ = true
    }else{
      this.Access__ = false
    }
  }




  // LIST ACHAT


  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }


  _onSelectedChange(date: Date): void {
    this.matButtonControle = undefined
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
    this.matButtonControle = undefined
    if (value == 0) {
      this.selectedDateRange = new DateRange(new Date(), new Date())
    }
    else if (value == 1) {
      this.selectedDateRange = new DateRange(new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate() - 1)))
    }
    else if (value == 7) {
      this.selectedDateRange = new DateRange(new Date(new Date().setDate(new Date().getDate() - 7)), new Date(new Date().setDate(new Date().getDate() - 1)))

    }
    else if (value == 30) {
      this.selectedDateRange = new DateRange(new Date(new Date().setDate(new Date().getDate() - 30)), new Date(new Date().setDate(new Date().getDate() - 1)))
    }
    else if (value === 'currentMonth') {
      this.selectedDateRange = new DateRange(new Date(new Date().setDate(1)), new Date(new Date().setDate(new Date().getDate())))

    }
    else {
      let lastMonth = new Date().getMonth();
      let year: any
      if (lastMonth == 0) {
        lastMonth = 11;
        year = new Date(new Date(new Date().setMonth(lastMonth)).setFullYear(new Date().getFullYear() - 1)).getFullYear()
      }
      else {
        lastMonth--;
        year = new Date(new Date().setMonth(lastMonth)).getFullYear()
      }
      let endValueDate = [0, 2, 4, 6, 7, 9, 11].includes(lastMonth) ? 31 : [1].includes(lastMonth) ? (year % 4 == 0) ? 29 : 28 : 30
      let endDate = new Date(new Date(new Date(new Date().setMonth(lastMonth)).setDate(endValueDate)).setFullYear(year))
      let startDate = new Date(new Date(new Date(new Date().setMonth(lastMonth)).setDate(1)).setFullYear(year))
      this.selectedDateRange =
        new DateRange(startDate, endDate)

    }

  }
  appliqueRange() {
    this.rangeFormGroup.get('start')?.setValue(this.selectedDateRange?.start)
    this.rangeFormGroup.get('end')?.setValue(this.selectedDateRange?.end)
    this.getPurchaseListe()
  }
  toggleStartDateDate(date: any, calendar: any) {
    const selected_date = moment(date).toDate()
    if (this.selectDateType === "startDateAfter") {
      this.start = selected_date
      this.ends = selected_date
      this.selectDateType = "startDateBefore"
    } else {
      if (moment(date).isBefore(moment(this.start))) {
        this.start = selected_date
        this.ends = selected_date
        this.selectDateType = "startDateBefore"
      } else {
        this.ends = selected_date
        this.selectDateType = "startDateAfter"
      }
    }
    this.selectedDateCalendar = new DateRange(moment(this.start), moment(this.ends))
    calendar.updateTodaysDate()
  }

  reset() {
    this.rangeFormGroup.reset();
    this.selectedDateRange = new DateRange(new Date(), null)
    this.matButtonControle = null
    this.dataSource.data = this.items = []
    this.onSubscribePurchage?.unsubscribe()
  }

  getVendor(items: any[]) {
    this.vendors = items.map(val => val.fournisseur)
    // console.log(this.vendors);
    this.FilterVendor.next(this.vendors);
    this.searchFilterVendorCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.FilterVendor.next(this.selectFilter.filterMethodWithFirstNameAndLastName(this.vendors, this.searchFilterVendorCtrl.value));
      });
  }

  onSubscribePurchage: any
  getPurchaseListe() {
    this.purchaseService.LISTFournisseurAchat('dashboard', 'achatdujour.php')
      .subscribe(data => {
        // console.log("Achat : ", data);
        this.dataSource.data = data
      });
  }

  filterVendor(vendorId: any) {
    if (vendorId != -1)
      this.dataSource.data = this.items.filter(data => data.fournisseur?.id == vendorId)
    else
      this.dataSource.data = this.items
  }




  // DETAILS (STATISTIQUE DASHBOARD)
  caisse: any = {}
  aujourdhui: Date = new Date()

  nbFournisseur = 0
  nbClient = 0
  nbAchatToday = 0
  TotalPoidsToday = 0
  poidsFixer = 0
  moyenneBourse = 0
  dashboard(): void {
    // DAYS
    this.service.getList_('dashboard', 'statistique.php')
      .subscribe({
        next: (data: any) => {
          // console.log("data " , data);
          this.nbFournisseur = data.nbFournisseur
          this.nbClient = data.nbClient
          this.nbAchatToday = data.nbAchatToday
          this.TotalPoidsToday = data.TotalPoidsToday
        }
      })

    // LOT

    // ACHAT

    // FIXING
    this.service.getList_('dashboard', 'fixingtoday.php')
      .subscribe({
        next: (data: any) => {
          // console.log("data ", data);
          this.poidsFixer = data.poidsFixer
          this.moyenneBourse = data.moyenneBourse
        }
      })

    // CAISSE
    this.service.getList_('caisse', 'filter_.php')
      .subscribe({
        next: (data: any) => {
          // console.log("data ", data);
          this.caisse = data
        }
      })

  }
  // END

}
