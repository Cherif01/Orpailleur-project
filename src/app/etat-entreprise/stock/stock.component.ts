import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EntrepriseService } from '../entreprise.service';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit {

  title = 'Detail du stock'
  selectedValue: string = '';
  selectedCar: string = '';

  // GET ACHAT FOURNISSEUR
  STOCK_PRINCIPALE_ENTRER_DU_JOUR: number = 0
  QTE_EXPEDIER: number = 0
  QTE_DIPONIBLE: number = 0


  constructor(
    private service: ApiserviceService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.getStock()
  }


  auj: Date = new Date()
  poidsAuj: number = 0
  poidsEntrer: number = 0
  allPoids: number = 0
  getStock(): void {
    // Poids total fixe
    this.service.LIST_ALL_PRECIS('stock', 'stock.php')
      .subscribe({
        next: (f: any) => {
          this.poidsEntrer += f.StockEntrer
          this.poidsAuj += f.poidsAuj
          this.allPoids += f.allPoids
        }
      })
  }

}
