import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PurchaseService } from '../purchase.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-create-facture-frs',
  templateUrl: './create-facture-frs.component.html',
  styleUrls: ['./create-facture-frs.component.css']
})
export class CreateFactureFrsComponent implements OnInit {

  @ViewChild('divToPrint') divToPrint: ElementRef | any;
  @ViewChild('head') head: ElementRef | any;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displaysColums: string[] = ["select", "Date", "Fournisseur", "Poids_total", "Fixing", "Poids vendu", "Discount", "Utilisateur", "Status"];
  selection = new SelectionModel<any>(true, []);

  title = 'Create Facture'
  idGet: any

  Fixing = this.fb.group({
    id: [, Validators.required],
    created_by: [1, Validators.required]
  })

  AchatL = this.fb.group({
    id: [, Validators.required],
    created_by: [1, Validators.required]
  })
  search = new FormControl();

  constructor(
    private serviceOperation: PurchaseService,
    private activeroute: ActivatedRoute,
    public location: Location,
    private fb: FormBuilder,
  ) {
    this.search.valueChanges.subscribe(v => {
      this.filterTable(v)
    })
  }
  filterTable(v: any) {
    throw new Error('Method not implemented.');
  }

  ngOnInit() {
    // ID Fournisseur EN GET
    this.idGet = this.activeroute.snapshot.params['id'];
    this.detailFixing()
  }

  // Reset form
  resetForm(form: FormGroup, fields: string[]) {
    fields.forEach(field => {
      form.controls[field].setValue(null);
      form.controls[field].updateValueAndValidity();
    })
  }

  // FIXING POST
  fournisseurName: any = ""
  TabItemsFix: any[] = [];
  infosFix: any = {}
  _TYPE_: any = false
  poidsTotal: number = 0
  carratMoyen: number = 0
  detailFixing() {
    this.serviceOperation.getList('api', 'fixing_detail')
      .subscribe({
        next: (data => {
          this.dataSource.data = data;
          console.log("detail", this.TabItemsFix)
        }),
        error: (err) => console.log(err)
      })
  }


  // Unique
  factureUnique: any = false;
  // Multiple
  factureMultiple: any = false;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    if (numSelected == 1) {
      this.factureUnique = true;
      this.factureMultiple = false;
    } else if (numSelected > 1) {
      this.factureMultiple = true;
      this.factureUnique = false;
    } else {
      this.factureUnique = false;
      this.factureMultiple = false;
      this.facture = false;
    }
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  tab: number = 0
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }


  poids_fixer: any
  fixing_bourse: any
  discount: any
  id_fixing: any

  logSelected() {
    let selected = this.selection.selected;
    let tab: any[] = [];
    selected.forEach(v => {
      tab.push({
        achat_items: v.id,
        achat: v.achat.id,
        fournisseur: v.achat.fournisseur.id,
        fixing: this.id_fixing,
        type_envoie: 1,
        created_by: 1,
      });
    });
  }


  facture: any = false;
  activeDetailFacture() {
    this.facture = true;
    // console.log("ETAT : ", this.facture);

  }

  //
  Total: number = 0
  calculPrice(pu: any, poids: any, carrat: any) {
    let Montant = ((pu / 22) * poids * carrat)
    this.Total += Montant
    return Number(Montant)
  }

  imprimerDiv(): void {
    let printContents = this.divToPrint.nativeElement.innerHTML;
    let originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }


}
