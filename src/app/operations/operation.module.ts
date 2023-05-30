import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPurchaseComponent, dialogAddPurchase } from './purchase/add-purchase/add-purchase.component';
import { ListPurchaseComponent } from './purchase/list-purchase/list-purchase.component';
import { DetailPurchaseComponent } from './purchase/detail-purchase/detail-purchase.component';
import { AddSaleComponent } from './sales/add-sale/add-sale.component';
import { DetailSaleComponent } from './sales/detail-sale/detail-sale.component';
import OperationRouting from './operation.routing';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FournisseurachatComponent } from './purchase/fournisseurachat/fournisseurachat.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { A11yModule } from '@angular/cdk/a11y';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InitPurchaseComponent } from './purchase/init-purchase/init-purchase.component';
import { FactureFournisseurComponent } from './purchase/facture-fournisseur/facture-fournisseur.component';
import { FacturepurchaseComponent } from './purchase/facturepurchase/facturepurchase.component';
import { CreateFactureFrsComponent } from './purchase/create-facture-frs/create-facture-frs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { NgxSelectModule } from 'ngx-select-ex';

@NgModule({
  declarations: [
    AddPurchaseComponent,
    ListPurchaseComponent,
    DetailPurchaseComponent,
    AddSaleComponent,
    DetailSaleComponent,
    FournisseurachatComponent,
    dialogAddPurchase,
    InitPurchaseComponent,
    FactureFournisseurComponent,
    FacturepurchaseComponent,
    CreateFactureFrsComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatDividerModule,
    A11yModule,
    MatTabsModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    NgxSelectModule,
    RouterModule.forChild(OperationRouting),
  ]
})
export class OperationModule { }
