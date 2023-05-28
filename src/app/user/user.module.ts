import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import LoginRouting from './user.routing';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(LoginRouting),
  ]
})
export class UserModule { }
