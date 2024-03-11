import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  // infoLgin = {
  //   username: 'admin',
  //   motDePasse: 'admin'
  // }
  userLogin = this.fb.group({
    username: [null, Validators.required],
    motDePasse: [null, Validators.required],
  })

  message: string = "Licence activer (3mois)"

  title = "Identification"
  constructor(
    public location: Location,
    private router: Router,
    private service: UserService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }


  ngOnInit(): void {
  }

  viewPass: boolean = false
  viewPassword(): void {
    let inputPass = document.getElementById('password_')
    inputPass?.setAttribute('type', 'text')
    this.viewPass = true
  }
  hiddenPassword(): void {
    let inputPass = document.getElementById('password_')
    inputPass?.setAttribute('type', 'password')
    this.viewPass = false
  }


  // loginSET() {
  //   let values = this.userLogin.value
  //   if (this.userLogin.valid && this.infoLgin.username === values.username! && this.infoLgin.motDePasse === values.motDePasse!) {
  //     localStorage.setItem('session', this.infoLgin.username + this.infoLgin.motDePasse);
  //     this.router.navigate(['/home']);
  //   } else {
  //     this.noLogin = true
  //   }
  // }

  RoleAdmin = "";
  RoleUser = "";
  updateRole(value: string) {
    if (value == "Administrateur") {
      this.RoleAdmin = value
      this.RoleUser = ''
    }
    if (value == "Utilisateur") {
      this.RoleUser = value
      this.RoleAdmin = ''
    }
  }

  noLogin: boolean = false
  authFunction(form: FormGroup) {
    console.log("Form : ", form.value);
    // const formData = convertObjectInFormData(this.userLogin)
    const formData = new FormData()
    formData.append('username', form.value.username)
    formData.append('motDePasse', form.value.motDePasse)
    formData.append('userRoleAdmin', this.RoleAdmin)
    formData.append('userRoleUser', this.RoleUser)
    this.service.loginService('auth', 'login.php', formData)
      .subscribe({
        next: (data: any) => {
          // console.log("reponse : ", data);
          if (data[1] == true) {
            localStorage.setItem('session', "auth");
            localStorage.setItem('id', data[0].id);
            localStorage.setItem('nomComplet', data[0].nomComplet);
            localStorage.setItem('role', data[0].role);
            localStorage.setItem('state', data[0].state);
            localStorage.setItem('username', data[0].username);
            this.router.navigate(['/home']);
          }
          else {
            this.noLogin = true
          }
        },
        error: (err: any) => {
          console.log("Error : ", err)
          this.snackBar.open("Identifiant Incorrect!", "Error", {
            duration: 4000,
            horizontalPosition: "center",
            verticalPosition: "top",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })
  }
}
