import { Component, OnInit } from '@angular/core';
import { OperationsService } from '../../operations.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-bourse-view',
  templateUrl: './bourse-view.component.html',
  styleUrls: ['./bourse-view.component.css']
})
export class BourseViewComponent implements OnInit {

  title = 'Bourse'
  goldPrice: number | undefined;

  constructor(private serviceOperations: OperationsService, public location: Location) { }

  ngOnInit(): void {
  }

  getGoldPrice() {
    this.serviceOperations.getGoldPrice("").subscribe(data => {
      this.goldPrice = data.result;
    });
  }

}
