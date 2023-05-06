import { Component, OnInit } from '@angular/core';
import { OperationsService } from 'src/app/operations/operations.service';

@Component({
  selector: 'app-fixing-client',
  templateUrl: './fixing-client.component.html',
  styleUrls: ['./fixing-client.component.css']
})
export class FixingClientComponent implements OnInit {

  title = 'Fixing Client'
  constructor(private serviceOperation: OperationsService) { }

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
