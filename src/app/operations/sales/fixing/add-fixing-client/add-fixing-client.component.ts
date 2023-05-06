import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationsService } from 'src/app/operations/operations.service';

@Component({
  selector: 'app-add-fixing-client',
  templateUrl: './add-fixing-client.component.html',
  styleUrls: ['./add-fixing-client.component.css']
})
export class AddFixingClientComponent implements OnInit {

  FixingClient = this.fb.group({
    client: [0, Validators.required],
    poids_fixe: [, Validators.required],
    fixing_bourse: [, Validators.required],
    created_by: [1, Validators.required]
  })

  title = 'Add Fixing Client'


  constructor(
    private fb: FormBuilder,
    private serviceOperation: OperationsService
  ) { }

  ngOnInit(): void {
    this.getClient();
  }


  // GetFourniseur
  ListCLient: any = []
  getClient(): void {
    this.serviceOperation.getList('client_api', 'client').subscribe({
      next: (data: any) => {
        // console.log(data),
        this.ListCLient = data
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
      form.reset()
    } else {
      console.log(form.value)
    }
  }


}
