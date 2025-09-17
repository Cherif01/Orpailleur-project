import { SelectionModel } from '@angular/cdk/collections';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { convertObjectInFormData } from 'src/app/etat-entreprise/caisse-principale/caisse-principale.component';

@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.css']
})
export class UtilisateurComponent implements OnInit {

  title = "settings/user"

  dataRole: any = ["Administrateur", "Utilisateur"]

  @ViewChild(MatSort) sort?: MatSort | any;
  @ViewChild(MatPaginator, { static: true })
  paginator: MatPaginator = Object.create(null);
  search = new FormControl();

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums: string[] = ["id", "username", "famille", "libelle", "url", "statut"];
  selection = new SelectionModel<any>(true, []);

  userForm = this.fb.group({
    nomComplet: [null, Validators.required],
    username: [null, Validators.required],
    userRole: [null, Validators.required]
  })

  accessForm = this.fb.group({
    id_menu: [null, Validators.required],
    id_user: [null, Validators.required]
  })

  constructor(
    public location: Location,
    private fb: FormBuilder,
    private service: ApiserviceService,
    private snackBar: MatSnackBar
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }

  ngOnInit(): void {
    this.getAllUser()
    this.getAllMenu()
    this.getAllAccess()
  }

  listUser: any = []

  getAllUser() {
    this.service.LIST_ALL_PRECIS('auth', 'read.php').subscribe({
      next: (data: any) => {
        // console.log(data),
        data.forEach((user: any) => {
          this.listUser.push(user);
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

  addUser(form: FormGroup) {
    // console.log(form.value);
    const formData = convertObjectInFormData(form.value)
    this.service.create('auth', 'create.php', formData)
      .subscribe({
        next: (reponse: any) => {
          this.listUser = []
          this.getAllUser()
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

  addAccess(form: FormGroup) {
    // console.log(form.value);
    // return
    const formData = new FormData()
    formData.append('id_menu', form.value.id_menu)
    formData.append('id_user', form.value.id_user)
    this.service.create('menu', 'access.php', formData)
      .subscribe({
        next: (reponse: any) => {
          // this.dataSource.data = []
          console.log(reponse);
          if (reponse[0].access == true) {
            this.snackBar.open("Access deja accorder pour cet utilisateur!", "Okay", {
              duration: 4000,
              horizontalPosition: "right",
              verticalPosition: "bottom",
              panelClass: ['bg-danger', 'text-white']
            })
          } else {
            this.snackBar.open("Access accorder !", "Okay", {
              duration: 3000,
              horizontalPosition: "right",
              verticalPosition: "top",
              panelClass: ['bg-success', 'text-white']
            })
            this.getAllAccess()
            window.location.reload()
          }
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


  // LISTE ES MENU
  listMenu: any = []
  getAllMenu() {
    this.service.LIST_ALL_PRECIS('menu', 'read.php').subscribe({
      next: (data: any) => {
        // console.log(data),
        data.forEach((menu: any) => {
          // console.log("menu : ", menu);
          this.listMenu.push(menu);
        })
      },
      error: (err: any) => console.log(err)
    })
  }


  // LISTE ES MENU
  listAccess: any = []
  getAllAccess() {
    this.service.LIST_ALL_PRECIS('menu', 'list-access.php').subscribe({
      next: (data: any) => {
        // console.log(data),
        data.forEach((menu: any) => {
          // console.log("Access : ", menu);
          this.dataSource.data = data;
          this.dataSource.paginator = this.paginator;
        })
      },
      error: (err: any) => console.log(err)
    })
  }

  filterTable(value: string) {
    this.dataSource.filter = value?.trim()?.toLowerCase();
  }

}
