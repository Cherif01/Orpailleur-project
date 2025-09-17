import { Component, OnInit, Inject } from '@angular/core'
import * as jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { ApiserviceService } from 'src/app/api_service/apiservice.service'
import { ActivatedRoute } from '@angular/router'
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-list1',
  templateUrl: './list1.component.html',
  styleUrls: ['./list1.component.css']
})
export class List1Component implements OnInit {
  dataExpedition: any[] = [];

  constructor (
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: ApiserviceService,
    private activeroute: ActivatedRoute
  ) {}

  ngOnInit (): void {
    this.getListExpedition_()
    // console.log("Data : ")
  }

  client: string = ''
  getListExpedition_(): void {
    const id = this.data.id; // Récupérez l'ID depuis les données injectées
    this.service.LIST_BY_ID('client', 'getByPoidsClient.php', id).subscribe({
      next: (reponse: any) => {
        // console.log('Liste expedition poids : ', data);
        this.dataExpedition = reponse;
      },
      error: (err: any) => console.log('erreur : ', err)
    });
  }

  exportToPDF () {
    const data: any = document.getElementById('tableToExport')
    html2canvas(data).then(canvas => {
      const imgWidth = 208
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF.jsPDF('p', 'mm', 'a4')
      pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save('table.pdf')
    })
  }
}
