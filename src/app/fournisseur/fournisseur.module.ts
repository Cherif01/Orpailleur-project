import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailFournisseurComponent } from './detail-fournisseur/detail-fournisseur.component';
import { AddFournisseurComponent } from './add-fournisseur/add-fournisseur.component';
import { ListFournisseurComponent } from './list-fournisseur/list-fournisseur.component';
import { RouterModule } from '@angular/router';
import FournisseurRouting from './fournisseur.routing';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
// DataTables
import { MatIconModule } from '@angular/material/icon';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FactureachatComponent } from './facture/factureachat/factureachat.component';
import { FactureventeComponent } from './facture/facturevente/facturevente.component';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { SituationFournisseurComponent } from './situation-fournisseur/situation-fournisseur.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTabsModule } from '@angular/material/tabs';


@NgModule({
  declarations: [
    AddFournisseurComponent,
    DetailFournisseurComponent,
    ListFournisseurComponent,
    FactureachatComponent,
    FactureventeComponent,
    SituationFournisseurComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatTableModule,
    MatCardModule,
    DataTablesModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatTabsModule,
    RouterModule.forChild(FournisseurRouting),
  ]
})
export class FournisseurModule { }
