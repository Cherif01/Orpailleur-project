import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { imprimerDiv } from 'src/app/app.component';
import { FixingClientDialogComponent } from 'src/app/etat-entreprise/fixing-client-dialog/fixing-client-dialog.component';

@Component({
  selector: 'app-facture-achat',
  templateUrl: './facture-achat.component.html',
  styleUrls: ['./facture-achat.component.css'],
})
export class FactureAchatComponent implements OnInit {
  dataList: any = [];
  filteredData: any = []; // Store the filtered data
  searchTerm: string = ''; // Search term for filtering

  today: Date = new Date();
  factureId: number = Math.floor(Math.random() * 10000);
  qrData = `https://spa-technology.com/facture/` + this.factureId;

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;

  constructor(
    private service: ApiserviceService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FixingClientDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  // Fetch data from API
  poidsConakry: number = 0;
  carratConakry: number = 0;
  poidsDubai: number = 0;
  carratDubai: number = 0;
  getList(): void {
    this.service.LIST_BY_ID('client', 'getAchat.php', this.data.id).subscribe({
      next: (data: any) => {
        this.dataList = data.itemList;
        this.filteredData = [...this.dataList]; // Initialize filteredData with all items
        // AUtres valeurs
        this.poidsConakry = data.poidsConakry;
        this.carratConakry = data.carratConakry;
        this.poidsDubai = data.poidsDubai;
        this.carratDubai = data.carratDubai;
      },
      error: (err: any) => console.log('Erreur : ', err),
    });
  }

  imprimerDiv(): void {
    imprimerDiv(this.divToPrint.nativeElement.innerHTML);
  }
}
