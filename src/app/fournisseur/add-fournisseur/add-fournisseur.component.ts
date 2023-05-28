import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VendorServiceService } from '../vendor-service.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-add-fournisseur',
  templateUrl: './add-fournisseur.component.html',
  styleUrls: ['./add-fournisseur.component.css']
})
export class AddFournisseurComponent implements OnInit {


  Fournisseur = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    pays: [''],
    ville: [''],
    adresse: [''],
    telephone: ['', Validators.required],
    email: ['', Validators.required],
    created_by: [1, Validators.required]
  })

  constructor(
    private service: VendorServiceService,
    private fb: FormBuilder,
    private router: Router,
    public location: Location,
    private snackBar: MatSnackBar
  ) { }

  title = "Add - Fournisseur"

  ngOnInit(): void {
  }

  // Req
  FournisseurForm(form: FormGroup) {
    if (form.valid) {
      //Envoyer dans la Base
      this.service.fournisseurPost(form.value).subscribe({
        next: (reponse: any) => {
          this.snackBar.open("Enregistrer avec succès !", "Okay", {
            duration: 3000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-success', 'text-white']
          }),
          this.router.navigate(['fournisseur/list-fournisseur/']);
        },
        error: (err: any) => {
          console.log("ERREUR : ", err),
          this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
            duration: 4000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })
      form.reset()
    } else {
      console.log(form.value)
    }
  }


}
