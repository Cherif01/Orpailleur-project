import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { LotService } from '../lot.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    private service: LotService,
    private fb: FormBuilder,
    private router: Router,
    public location: Location,
    private snackBar: MatSnackBar
  ) { }

  title = "Add lot "

  ngOnInit(): void {
  }

  // Req
  AddLot(form: FormGroup) {
    if (form.valid) {
      //Envoyer dans la Base
      const formData = new FormData()
      formData.append('designation', form.value.designation)
      this.service.create('lot', 'create.php', formData)
        .subscribe({
          next: (reponse: any) => {
            // console.log("response ", reponse);
            this.snackBar.open(reponse.message, undefined, {
              duration: 4000,
              horizontalPosition: "right",
              verticalPosition: "top",
              panelClass: [reponse.color, 'text-white']

            });
          },
          error: (err: any) => console.log("error " + err)
        })
      this.router.navigate(['/lot/list-lot'])
    } else {
      console.log("Formulaire inconnus, creation du lot");
    }
  }

}
