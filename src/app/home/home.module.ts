import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { homeRouting } from './home.routing';
import { DemoMaterialModule } from '../demo-material-module';
import { MatCardModule } from '@angular/material/card';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(homeRouting),
    DemoMaterialModule
  ]
})
export class HomeModule { }
