import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.css']
})
export class AccessComponent implements OnInit {

  title = "settings/menu-access"

  dataRole: any = ["Administrateur", "Utilisateur"]

  menuForm = this.fb.group({
    Famille: [null, Validators.required],
    libelle: [null, Validators.required],
    icons: [null],
    url: [null, Validators.required]
  })

  accessForm = this.fb.group({
  })

  constructor(
    public location: Location,
    private fb: FormBuilder,
    private service: ApiserviceService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getAllMenu()
  }

  listMenu: any = []

  getAllMenu() {
    this.service.LIST_ALL_PRECIS('menu', 'read.php').subscribe({
      next: (data: any) => {
        // console.log(data),
          data.forEach((user: any) => {
            this.listMenu.push(user);
          })
      },
      error: (err: any) => console.log(err)
    })
  }

  stateFunction(value: number): any {
    switch (value) {
      case 0:
        return "Offline";
      case 1:
        return "Online";
      default:
        break;
    }
  }
  statutFunction(value: number): any {
    switch (value) {
      case 0:
        return "Suspendu";
      case 1:
        return "En service";
      default:
        break;
    }
  }

  addMenu(form: FormGroup) {
    // console.log(form.value);
    const formData = convertObjectInFormData(form.value)
    this.service.create('menu', 'create.php', formData)
      .subscribe({
        next: (reponse: any) => {
          this.listMenu = []
          this.getAllMenu()
          this.snackBar.open("Enregistrer avec succès !", "Okay", {
            duration: 3000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ['bg-success', 'text-white']
          })
        },
        error: (err: any) => {
          console.log("ERREUR : ", err),
            this.snackBar.open("Echec, Veuillez reessayer!", "Okay", {
              duration: 4000,
              horizontalPosition: "center",
              verticalPosition: "bottom",
              panelClass: ['bg-danger', 'text-white']
            })
        }
      })
    form.reset()
  }



}
