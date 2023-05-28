import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { MatCardModule } from '@angular/material/card';
import EntrepriseRouting from './entreprise.routing';
import { CaissePrincipaleComponent } from './caisse-principale/caisse-principale.component';
import { CaisseDialogComponent } from './caisse-principale/caisse-dialog/caisse-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { EntrerCaisseComponent } from './caisse-principale/entrer-caisse/entrer-caisse.component';
import { SortieCaisseComponent } from './caisse-principale/sortie-caisse/sortie-caisse.component';
import { CaisseOptDialogComponent } from './caisse-principale/caisse-opt-dialog-entrer/caisse-opt-dialog.component';
import { CaisseOptDialogSortieComponent } from './caisse-principale/caisse-opt-dialog-sortie/caisse-opt-dialog-sortie.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    StockComponent,
    CaissePrincipaleComponent,
    CaisseDialogComponent,
    EntrerCaisseComponent,
    SortieCaisseComponent,
    CaisseOptDialogComponent,
    CaisseOptDialogSortieComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    RouterModule.forChild(EntrepriseRouting),
    MatDialogModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatTabsModule,
    MatIconModule
  ]
})
export class EntrepriseStateModule { }
