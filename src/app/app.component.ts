import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;


  title = 'Groupe - LIMANAYA _ BUSINESS';
  loginUsername = localStorage.setItem("Username", "admin")
  loginPassword = localStorage.setItem("Username", "admin")
  public sessionUSER: any = window.localStorage.setItem("USERNAME", "admin")

  canShowMenu = true;
  constructor(
    public location: Location,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // `event.url` contient l'URL actuelle
        this.canShowMenu = event.url !== '/user/login';
        // Vous pouvez effectuer des vérifications supplémentaires ici
      });
  }
}

export function imprimerDiv(divToPrint: any): void {
  // let printContents = this.divToPrint.nativeElement.innerHTML;
  let printContents = divToPrint
  let styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map((node) => node.outerHTML).join('');
  let iframe: any = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write('<html><head><title>Impression</title>' + styles + '</head><body>' + printContents + '</body></html>');
  iframeDoc.close();
  iframe.onload = function () {
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };
}

export function imprimerDivDupliquer(divsToPrint: any[]): void {
  let styles = Array.from(document.querySelectorAll('link[rel="stylesheet"], style')).map((node) => node.outerHTML).join('');
  let iframe: any = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  let iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
  iframeDoc.open();
  iframeDoc.write('<html><head><title>Impression</title>' + styles + '</head><body>');

  // Itérer sur toutes les duplications
  divsToPrint.forEach((divToPrint) => {
    let printContents = divToPrint.innerHTML;
    iframeDoc.write('<div>' + printContents + '</div>');
  });

  iframeDoc.write('</body></html>');
  iframeDoc.close();
  iframe.onload = function () {
    iframe.contentWindow.print();
    document.body.removeChild(iframe);
  };
}

export function format2Chart(data: any) {
  let tab = data.toString().split(".");
  if (tab.length < 2)
    return Number(data);
  return Number(tab[0].concat('.', tab[1].substr(0, 2)));
}



export function generatePDF(nameFournisseur?: string): void {
  const doc = new jsPDF();

  const divElement: any = document.getElementById('facture'); // Remplacez 'facture' par l'ID de votre div

  html2canvas(divElement).then((canvas) => {
    const imageData = canvas.toDataURL('image/png');

    const imgWidth = 190; // Largeur de l'image dans le document PDF
    const imgHeight = canvas.height * imgWidth / canvas.width; // Calcul de la hauteur proportionnelle à la largeur

    doc.addImage(imageData, 'PNG', 10, 10, imgWidth, imgHeight); // Ajout de l'image au document PDF

    // Enregistrement du document PDF
    doc.save('_facture_suivant_(' + (nameFournisseur) + ').pdf');
  });
}


export function refreshInFewMinute(refresh: any): void {
  interval(5000) // Émet une valeur toutes les 60000 millisecondes (1 minute)
    // .pipe(take(5)) // Limite le nombre total d'émissions à 5 (facultatif)
    .subscribe(() => {
      refresh
    });
}
