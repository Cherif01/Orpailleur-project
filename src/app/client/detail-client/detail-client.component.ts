import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-client',
  templateUrl: './detail-client.component.html',
  styleUrls: ['./detail-client.component.css']
})
export class DetailClientComponent implements OnInit {

  constructor(
    private router: Router,
    public location: Location,
  ) { }

  clientOperation = new FormGroup({
    operation_client: new FormControl('',[Validators.required]),
    montant_client: new FormControl('',[Validators.required]),
  })

  title = "Details"

  ngOnInit(): void {
  }

  addMouvClient(form: FormGroup) {
    console.log("Form : ", form.value);

  }
}
