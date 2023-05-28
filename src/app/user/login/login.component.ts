import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  title = "Identification"
  constructor(
    public location: Location,
    private varSession: AppComponent
  ) { }


  ngOnInit(): void {
    console.log("SESSION : ", this.varSession.sessionUSER);
  }


  loginSET() {

  }

}
