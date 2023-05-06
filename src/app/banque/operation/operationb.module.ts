import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DepotComponent } from './depot/depot.component';
import { RetraitComponent } from './retrait/retrait.component';
import { VirementComponent } from './virement/virement.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import OperationBancaireRouting from './operationb.routing';



@NgModule({
  declarations: [
    DepotComponent,
    RetraitComponent,
    VirementComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(OperationBancaireRouting)
  ]
})
export class OperationbModule { }
