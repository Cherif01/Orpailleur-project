import { Location } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { interval } from 'rxjs';

import printJS from 'print-js'; // ✅ fonctionne avec esModuleInterop + allowSyntheticDefaultImports

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  @ViewChild('divToPrint') divToPrint!: ElementRef;
  @ViewChild('head') head!: ElementRef;

  title = 'Groupe - LIMANAYA _ BUSINESS';

  canShowMenu = true;
  isPopupVisible = true;

  constructor(public location: Location, private router: Router) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        this.canShowMenu = event.url !== '/user/login';
      });
  }

  ngOnInit() {
    const popupClosed = localStorage.getItem('popupClosed');
    if (popupClosed) {
      this.isPopupVisible = false;
    }
  }

  closePopup() {
    this.isPopupVisible = false;
    localStorage.setItem('popupClosed', 'true');
  }
}

/**
 * Impression directe avec printJS (optimisée pour être immédiate)
 */
/**
 * Impression directe avec printJS (corrigée)
 */
export function impressionDoc(): void {
  const section = document.getElementById('print-section');

  if (!section) {
    console.error('❌ Aucun élément trouvé avec id="print-section"');
    return;
  }

  printJS({
    printable: section.innerHTML, // ⚡ on passe directement le contenu HTML
    type: 'raw-html', // 👈 clé : utiliser raw-html pour HTML direct
    documentTitle: 'Rapport - LIMANAYA',
    style: `
      body { font-family: "Segoe UI", Arial, sans-serif; font-size: 14px; margin: 10px; }
      h2, h3 { margin: 5px 0; font-weight: bold; }
      .entete { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
      .entete img { max-height: 70px; }
      .facture-header-text { flex: 1; text-align: center; }
      table { border-collapse: collapse; width: 100%; margin-top: 10px; }
      th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 13px; }
      th { background-color: #c18b3b; color: #fff; text-transform: uppercase; }
      tfoot td, tfoot th { font-weight: bold; background: #f2f2f2; color: #8b0000; }
    `,
  });
}

/**
 * Impression via iframe (alternative sans printJS)
 */
export function imprimerDiv(divToPrint: any): void {
  const printContents = divToPrint;
  const styles = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((node) => node.outerHTML)
    .join('');

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write(`
    <html><head><title>Impression</title>${styles}</head><body>${printContents}</body></html>
  `);
  iframeDoc.close();

  iframe.onload = () => {
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
  };
}

/**
 * Impression de plusieurs divs
 */
export function imprimerDivDupliquer(divsToPrint: any[]): void {
  const styles = Array.from(
    document.querySelectorAll('link[rel="stylesheet"], style')
  )
    .map((node) => node.outerHTML)
    .join('');

  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write(
    `<html><head><title>Impression</title>${styles}</head><body>`
  );

  divsToPrint.forEach((divToPrint) => {
    iframeDoc.write(`<div>${divToPrint.innerHTML}</div>`);
  });

  iframeDoc.write('</body></html>');
  iframeDoc.close();

  iframe.onload = () => {
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
  };
}

/**
 * Formateur de nombre avec 2 décimales max
 */
export function format2Chart(data: any) {
  const tab = data.toString().split('.');
  if (tab.length < 2) return Number(data);
  return Number(tab[0].concat('.', tab[1].substr(0, 2)));
}

/**
 * Génération PDF depuis un élément HTML
 */
export function generatePDF(nameFournisseur?: string): void {
  const doc = new jsPDF();
  const divElement: HTMLElement | null = document.getElementById('facture');

  if (!divElement) {
    console.error('❌ Aucun élément trouvé avec id="facture"');
    return;
  }

  html2canvas(divElement).then((canvas) => {
    const imageData = canvas.toDataURL('image/png');
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imageData, 'PNG', 10, 10, imgWidth, imgHeight);
    doc.save(`_facture_suivant_(${nameFournisseur || 'inconnu'}).pdf`);
  });
}

/**
 * Rafraîchissement auto toutes les 5 secondes
 */
export function refreshInFewMinute(refresh: () => void): void {
  interval(5000).subscribe(() => {
    refresh();
  });
}
