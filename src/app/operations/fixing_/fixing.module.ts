import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddFixingComponent } from './add-fixing/add-fixing.component';
import { RouterModule } from '@angular/router';
import FixingRouting from './fixing.routing';
import { MatCardModule } from '@angular/material/card';
import { ListFixingComponent } from './list-fixing/list-fixing.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
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
import { BourseViewComponent } from './bourse-view/bourse-view.component';
import { MatSortModule } from '@angular/material/sort';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    AddFixingComponent,
    ListFixingComponent,
    BourseViewComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    CommonModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatDividerModule,
    A11yModule,
    NgxMatSelectSearchModule,
    MatSelectModule,
    MatRadioModule,
    MatCheckboxModule,
    MatSortModule,
    RouterModule.forChild(FixingRouting),
  ]
})
export class FixingModule { }
