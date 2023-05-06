import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateRange, MatDateRangePicker } from '@angular/material/datepicker';
import * as moment from 'moment';
import { ReplaySubject, Subject } from 'rxjs';
import { SelectFilterService } from 'src/app/services/select-filter.service';
import { PurchaseService } from '../purchase.service';
import { Location } from '@angular/common';




@Component({
  selector: 'app-list-purchase',
  templateUrl: './list-purchase.component.html',
  styleUrls: ['./list-purchase.component.css']
})
export class ListPurchaseComponent implements OnInit {

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
    public location: Location
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  upDown = true
  title = "Achat";
  items: any[] = []
  dataAchat: any[] = []
  displaysColums = ["created_at", "slug", "fournisseur", "poids_total" ,"carrat_achat", "telephone", "action"];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();


  ngOnInit(): void {
    this.getPurchaseListe();
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
    this.onSubscribePurchage = this.purchaseService
      .getListePurchase(this.rangeFormGroup.value)
      .pipe(
        map(data => {
          let result: any[] = [];
          // console.log(data)
          data.forEach(item => {
            let index = result.findIndex(i => i.slug === item.slug);
            if (index === -1) {
              result.push({
                id: item.id,
                date_achat: item.created_at,
                slug: item.slug,
                fournisseur: item.fournisseur,
                poids_total: item.poids_total,
                carrat_moyen: item.carrat_moyen,
              });
            } else {
              result[index].poids_achat += item.poids_achat;
            }
            // console.log("ITEM : " + item);
          });
          // console.log(result);
          this.dataSource.data = result;
          // console.log(this.dataSource.data);
          return result;
        })
      )
      .subscribe(data => {
        this.items = data;
        // this.dataSource.data = this.items
        this.dataSource.paginator = this.paginator
        this.getVendor(this.items)
      });

  }

  filterVendor(vendorId: any) {
    if (vendorId != -1)
      this.dataSource.data = this.items.filter(data => data.fournisseur?.id == vendorId)
    else
      this.dataSource.data = this.items
  }

}
