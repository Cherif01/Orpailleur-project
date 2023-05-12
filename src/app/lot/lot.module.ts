import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AddLotComponent } from './add-lot/add-lot.component';
import { ListLotComponent } from './list-lot/list-lot.component';
import { DetailLotComponent } from './detail-lot/detail-lot.component';
import { RouterModule } from '@angular/router';
import LotRouting from './lot.routing';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [
    AddLotComponent,
    ListLotComponent,
    DetailLotComponent
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
    RouterModule.forChild(LotRouting),
    DragDropModule,
  ]
})
export class LotModule { }
