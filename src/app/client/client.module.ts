import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListClientComponent } from './list-client/list-client.component';
import { DetailClientComponent } from './detail-client/detail-client.component';
import { RouterModule } from '@angular/router';
import ClientRouting from './client.routing';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { List1Component } from './_modal/list1/list1.component';
import { UpdateFixingComponent } from './_modal/update-fixing/update-fixing.component';
import { DemoMaterialModule } from '../demo-material-module';
import { EditExpeditionComponent } from './_modal/edit-expedition/edit-expedition.component';
import { FactureAchatComponent } from './_modal/facture-achat/facture-achat.component';

@NgModule({
  declarations: [
    ListClientComponent,
    DetailClientComponent,
    List1Component,
    UpdateFixingComponent,
    EditExpeditionComponent,
    FactureAchatComponent,
  ],
  imports: [
    CommonModule,
    DemoMaterialModule,
    MatMenuModule,
    MatCheckboxModule,
    RouterModule.forChild(ClientRouting),
  ],
})
export class ClientModule {}
