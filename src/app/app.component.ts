import { Location } from '@angular/common';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Groupe - LIMANAYA _ BUSINESS';
  loginUsername = localStorage.setItem("Username", "admin")
  loginPassword = localStorage.setItem("Username", "admin")
  public sessionUSER: any = window.localStorage.setItem("USERNAME", "admin")

  constructor(
    public location: Location,
  ){
    // console.log("LOG : ", this.sessionUSER);
  }


}
