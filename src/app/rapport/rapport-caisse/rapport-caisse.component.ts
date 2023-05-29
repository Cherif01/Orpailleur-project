import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { RapportService } from 'src/app/rapport.service';
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-rapport-caisse',
  templateUrl: './rapport-caisse.component.html',
  styleUrls: ['./rapport-caisse.component.css']
})
export class RapportCaisseComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  rechercheIntervalleForm = new FormGroup({
    dateStart: new FormControl<any>(null),
    dateEnd: new FormControl<any>(null)
  })

  // VARIABLES
  totalEntrerUSD: number = 0
  totalSortieUSD: number = 0
  totalEntrerGNF: number = 0
  totalSortieGNF: number = 0
  totalRetourUSD: number = 0
  totalDecaissementUSD: number = 0
  totalRetourGNF: number = 0
  totalDecaissementGNF: number = 0
  resultatESE_gnf: number = 0
  resultatESE_usd: number = 0
  resultatFRS_gnf: number = 0
  resultatFRS_usd: number = 0

  constructor(
    private serviceRapport: RapportService,
    public location: Location
  ) {
  }

  title = "Rapport caisse"

  ngOnInit() {
    // Datatables
    this.getCaisseInformation()
  }

  // CAISSE ELEMENT
  historique: any[] = []
  historiqueIntervalle: any[] = []
  Today_h: Date = new Date()
  getCaisseInformation(): void {
    this.serviceRapport.getList('api', 'caisse')
      .subscribe({
        next: ((data: any) => {
          data.forEach((item: any) => {
            this.historiqueIntervalle.push(item)
            let dateDB_ = new Date(item.created_at)
            if (dateDB_.getDay() == this.Today_h.getDay()) {
              // console.log(item);
              this.historique.push(item)
              switch (item.operation) {
                case 1:
                  if (item.devise == 1) {
                    this.totalEntrerGNF += parseFloat(item.montant)
                    this.resultatESE_gnf += parseFloat(item.montant)
                  } else {
                    this.totalEntrerUSD += parseFloat(item.montant)
                    this.resultatESE_usd += parseFloat(item.montant)
                  }
                  break;
                case 2:
                  if (item.devise == 1) {
                    this.totalSortieGNF += parseFloat(item.montant)
                    this.resultatESE_gnf += parseFloat(item.montant)
                  } else {
                    this.resultatESE_usd -= parseFloat(item.montant)
                    this.totalSortieUSD += parseFloat(item.montant)
                  }
                  break;
                case 3:
                  if (item.devise == 1) {
                    this.totalRetourGNF += parseFloat(item.montant)
                    this.resultatFRS_gnf += parseFloat(item.montant)
                  } else {
                    this.totalRetourUSD += parseFloat(item.montant)
                    this.resultatFRS_usd += parseFloat(item.montant)
                  }
                  break;
                case 4:
                  if (item.devise == 1) {
                    this.totalDecaissementGNF += parseFloat(item.montant)
                    this.resultatFRS_gnf -= parseFloat(item.montant)
                  } else {
                    this.totalDecaissementUSD += parseFloat(item.montant)
                    this.resultatFRS_usd -= parseFloat(item.montant)
                  }
                  break;
              }
            }
          })
        })
      })
  }

  resetTab() {
    this.historique = []
    // VARIABLES
  }
  totalEntrerUSDR = 0
  totalSortieUSDR = 0
  totalEntrerGNFR = 0
  totalSortieGNFR = 0
  totalRetourUSDR = 0
  totalDecaissementUSDR = 0
  totalRetourGNFR = 0
  totalDecaissementGNFR = 0
  resultatESE_gnfR = 0
  resultatESE_usdR = 0
  resultatFRS_gnfR = 0
  resultatFRS_usdR = 0
  startDate: any
  endDate: any

  // RAPPORT PERSONNALISER
  rapportPersonnaliser(formSearch: any) {
    console.log("Date : ", formSearch.value);
    let Date1: any = new Date(formSearch.value.dateStart)
    let Date2: any = new Date(formSearch.value.dateEnd)
    this.startDate = Date1.toLocaleDateString()
    this.endDate = Date2.toLocaleDateString()
    this.totalEntrerUSDR = 0
    this.totalSortieUSDR = 0
    this.totalEntrerGNFR = 0
    this.totalSortieGNFR = 0
    this.totalRetourUSDR = 0
    this.totalDecaissementUSDR = 0
    this.totalRetourGNFR = 0
    this.totalDecaissementGNFR = 0
    this.resultatESE_gnfR = 0
    this.resultatESE_usdR = 0
    this.resultatFRS_gnfR = 0
    this.resultatFRS_usdR = 0

    // console.log("Date1 : ", Date1.toLocaleDateString());
    // console.log("Date2 : ", Date2.toLocaleDateString());

    this.historiqueIntervalle.forEach((item: any) => {
      let dateDB_ = new Date(item.created_at)
      // console.log("Date DB : ", dateDB_.toLocaleDateString());

      if (dateDB_ >= Date1 && dateDB_ <= Date2) {
        console.log("item trouve : ", item);
        this.historique.push(item)
        switch (item.operation) {
          case 1:
            if (item.devise == 1) {
              this.totalEntrerGNFR += parseFloat(item.montant)
              this.resultatESE_gnfR += parseFloat(item.montant)
            } else {
              this.totalEntrerUSDR += parseFloat(item.montant)
              this.resultatESE_usdR += parseFloat(item.montant)
            }
            break;
          case 2:
            if (item.devise == 1) {
              this.totalSortieGNFR += parseFloat(item.montant)
              this.resultatESE_gnfR += parseFloat(item.montant)
            } else {
              this.resultatESE_usdR -= parseFloat(item.montant)
              this.totalSortieUSDR += parseFloat(item.montant)
            }
            break;
          case 3:
            if (item.devise == 1) {
              this.totalRetourGNFR += parseFloat(item.montant)
              this.resultatFRS_gnfR += parseFloat(item.montant)
            } else {
              this.totalRetourUSDR += parseFloat(item.montant)
              this.resultatFRS_usdR += parseFloat(item.montant)
            }
            break;
          case 4:
            if (item.devise == 1) {
              this.totalDecaissementGNFR += parseFloat(item.montant)
              this.resultatFRS_gnfR -= parseFloat(item.montant)
            } else {
              this.totalDecaissementUSDR += parseFloat(item.montant)
              this.resultatFRS_usdR -= parseFloat(item.montant)
            }
            break;
        }
      }
    })

    // console.log("Date1 : ", start);
    // console.log("Date2 : ", end);
    // console.log("Historye : ", this.historiqueIntervalle);

  }

  imprimerDiv(): void {
    let printContents = this.divToPrint.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }

  // generatePDF() {
  //   const doc = new jsPDF();
  //   const divElement: any = document.getElementById('recu'); // Remplacez 'divId' par l'ID de votre div

  //   // Utilisez la méthode html2canvas pour capturer la div sous forme d'image
  //   html2canvas(divElement).then((canvas) => {
  //     const imageData = canvas.toDataURL('image/png');

  //     // Ajoutez l'image capturée au document PDF
  //     doc.addImage(imageData, 'PNG', 10, 10, 190, 280); // Modifiez les coordonnées et la taille selon vos besoins

  //     // Enregistrez le document PDF
  //     doc.save('_recu_caisse_.pdf');
  //   });
  // }

}
