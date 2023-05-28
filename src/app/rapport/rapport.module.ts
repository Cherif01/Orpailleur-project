import { NgModule } from "@angular/core";
import { CommonModule, DatePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import rapportRouting from "./rapport.routing";
import { RouterModule } from "@angular/router";
import { MatDialogModule } from "@angular/material/dialog";
import { RapportFournisseurComponent } from './rapport-fournisseur/rapport-fournisseur.component';
import { RapportClientComponent } from './rapport-fournisseur/rapport-client/rapport-client.component';
import { MatMenuModule } from "@angular/material/menu";
import { RapportCaisseComponent } from './rapport-caisse/rapport-caisse.component';
import { MatNativeDateModule } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";



@NgModule({
  declarations: [
    RapportFournisseurComponent,
    RapportClientComponent,
    RapportCaisseComponent
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    FormsModule,
    MatIconModule,
    ReactiveFormsModule,
    DatePipe,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatTableModule,
    MatTabsModule,
    MatDialogModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    RouterModule.forChild(rapportRouting)
  ]
})
export class rapportModule { }
