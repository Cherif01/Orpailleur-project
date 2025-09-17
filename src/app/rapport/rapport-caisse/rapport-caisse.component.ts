import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { Location } from '@angular/common'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { imprimerDiv } from 'src/app/app.component'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'

@Component({
  selector: 'app-rapport-caisse',
  templateUrl: './rapport-caisse.component.html',
  styleUrls: ['./rapport-caisse.component.css']
})
export class RapportCaisseComponent implements OnInit {
  @ViewChild('divToPrint') divToPrint: ElementRef | any
  @ViewChild('head') head: ElementRef | any

  rechercheIntervalleForm = new FormGroup({
    dateStart: new FormControl<any>('', Validators.required),
    dateEnd: new FormControl<any>(null)
  })

  constructor (public location: Location, private service: ApiserviceService) {}

  title = 'Rapport caisse'

  ngOnInit () {
    // Datatables
    this.getCaisse()
  }

  historique: any[] = []
  date1: string = ''
  date2: string = ''
  montantAnterieur: number = 0
  getCaisse (): void {
    // console.log("Valid: ", this.rechercheIntervalleForm.value);
    if (this.rechercheIntervalleForm.valid) {
      this.date1 = this.rechercheIntervalleForm.value.dateStart
      this.date2 = this.rechercheIntervalleForm.value.dateEnd
      this.montantAnterieur = 0
      //
      let values = this.rechercheIntervalleForm.value
      this.service
        .LIST_SEARCH('public', 'readbyclause.php', 'table_caisse', {
          startDate: new Date(values.dateStart!).getTime(),
          endDate: values.dateEnd
            ? new Date(values.dateEnd).getTime()
            : new Date(values.dateStart!).getTime()
        })
        .subscribe({
          next: (data: any) => {
            // console.log('data : ', data);
            this.historique = data
            data.forEach((element: any) => {
              this.montantAnterieur = element.montant_anterieur
            });
          }
        })
    }
  }

  resetTab () {
    this.historique = []
    this.montantAnterieur = 0
    this.date1 = ''
    this.date2 = ''
    // VARIABLES
  }

  imprimerDiv (): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML)
  }
}
