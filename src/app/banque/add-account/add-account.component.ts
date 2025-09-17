import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BanqueService } from '../banque.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-account',
  templateUrl: './add-account.component.html',
  styleUrls: ['./add-account.component.css']
})
export class AddAccountComponent implements OnInit {

  Particulier = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    pays: ['', Validators.required],
    ville: ['', Validators.required],
    adresse: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', Validators.email],
    created_by: [1, Validators.required],
    updated_by: [1, Validators.required]
  })

  constructor(
    private fb: FormBuilder,
    private BankService: BanqueService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  title = "Add account";

  ngOnInit(): void {
  }

  // Add particulier
  // Req
  ParticulierAdd(form: FormGroup) {
    if (form.valid) {
      //Envoyer dans la Base
      this.BankService.Add(form.value, 'particulier_api', 'particulier').subscribe({
        next: (reponse: any) => {
          console.log(reponse),
          this.snackBar.open("Compte particulier creer avec succès !", "Okay", {
            duration: 5000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          }),
          this.router.navigate(['/bank/list-account/']);
        },
        error: (err: any) => {
          this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
            duration: 4000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })
      form.reset()
    }
  }

}
