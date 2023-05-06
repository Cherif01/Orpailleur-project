import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from '../../operations.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-fixing',
  templateUrl: './add-fixing.component.html',
  styleUrls: ['./add-fixing.component.css']
})

export class AddFixingComponent implements OnInit {

  Fixing = this.fb.group({
    fournisseur: [0, Validators.required],
    poids_fixe: [, Validators.required],
    fixing_bourse: [, Validators.required],
    discompte: [, Validators.required],
    created_by: [1, Validators.required]
  })


  title = 'Add Fixing'

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private serviceOperation: OperationsService,
    public location: Location
  ) { }

  ngOnInit(): void {
    this.getFournisseur();
  }


  // GetFourniseur
  ListFrs: any = []
  getFournisseur(): void {
    this.serviceOperation.getList('api', 'fournisseur').subscribe({
      next: (data: any) => {
        // console.log(data),
        this.ListFrs = data
      },
      error: (err: any) => console.log(err)
    })
  }


  // ADD FIXING
  fixingPOST(form: FormGroup): void {
    if (form.valid) {
      //Envoyer dans la Base
      this.serviceOperation.Add(form.value, 'api', 'fixing').subscribe({
        next: (reponse: any) => {
          console.log("Poids fixe avec success... ")
        },
        error: (err: any) => console.log(err)
      })
      this.router.navigate(['fixing/list-fixing'])
      form.reset()
    } else {
      // console.log(form.value)
    }
  }


  // Infos
  InfosFournisseur: any = {}
  select: any = false
  infosVendor(idF: any): void {
    if(idF === undefined){
      this.select = false
      return
    }else{
      this.select = true
    }
    // console.log(idF);
    this.serviceOperation.getElementById('api', 'fournisseur', idF).subscribe({
      next: ((data) => {
        // console.log(data);
        this.InfosFournisseur = data
      })
    })
  }


}
