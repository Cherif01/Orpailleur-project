import { Component, OnInit } from '@angular/core';
import { OperationsService } from '../../operations.service';

@Component({
  selector: 'app-list-sale',
  templateUrl: './list-sale.component.html',
  styleUrls: ['./list-sale.component.css']
})
export class ListSaleComponent implements OnInit {

  constructor(private serviceOperation: OperationsService) { }

  title = "Vente"

  ngOnInit(): void {
    this.getAllVente()
  }

  // GET FIxing
  TabVente: any = []
  getAllVente() {
    this.serviceOperation.getList('client_api', 'vente').subscribe({
      next: (data: any) => {
        // console.log(data),
        this.TabVente = data;
      },
      error: (err: any) => console.log(err)
    })

  }

}
