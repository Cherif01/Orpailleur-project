import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ApiserviceService } from '../../api_service/apiservice.service'
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-lot',
  templateUrl: './add-lot.component.html',
  styleUrls: ['./add-lot.component.css']
})
export class AddLotComponent implements OnInit {

  LotForm = this.fb.group({
    designation: ['', Validators.required]
  })

  constructor(
    private service: ApiserviceService,
    private fb: FormBuilder,
    private router: Router,
    public location: Location
    ) { }

  Lot = this.fb.group({
    designation: ['', Validators.required],
    created_by: [1, Validators.required]
  })
  title = "Add lot "

  ngOnInit(): void {
  }

  // Req
  LotAddForm(form: FormGroup) {
    if (form.valid) {
      //Envoyer dans la Base
      this.service.lotPost(form.value).subscribe({
        next: (reponse: any) => console.log(reponse),
        error: (err: any) => console.log(err)
      })
      form.reset()
      this.router.navigate(['/lot/list-lot'])
    } else {
      console.log(form.value)
    }
  }

}
