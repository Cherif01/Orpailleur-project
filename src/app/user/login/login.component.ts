import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  infoLgin ={
    username: 'admin',
    password: 'admin'
  }
  userLogin = new FormGroup({
    username: new FormControl(null,[Validators.required]),
    password: new FormControl(null,[Validators.required])
  })

  title = "Identification"
  constructor(
    public location: Location,
    private varSession: AppComponent,
    private router: Router
  ) { }


  ngOnInit(): void {
    console.log("SESSION : ", this.varSession.sessionUSER);

  }


  loginSET() {
    let values = this.userLogin.value
    if(this.userLogin.valid && this.infoLgin.username === values.username! && this.infoLgin.password === values.password!){
      localStorage.setItem('session',this.infoLgin.username+this.infoLgin.password);
      this.router.navigate(['/home']);
    }
  }

}
