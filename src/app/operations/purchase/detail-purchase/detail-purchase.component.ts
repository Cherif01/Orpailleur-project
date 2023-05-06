import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ChangeDetectionStrategy, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { ActivatedRoute } from '@angular/router';
import { LINK_BASE, T_FOURNISSEUR } from 'src/app/config';
import { PurchaseService } from '../purchase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detail-purchase',
  templateUrl: './detail-purchase.component.html',
  styleUrls: ['./detail-purchase.component.css']
})
export class DetailPurchaseComponent implements OnInit {

  constructor(
    private activeroute: ActivatedRoute,
    private service: ApiserviceService,
    private http: HttpClient, private fb: FormBuilder,
    private purchaseService: PurchaseService,
    private snackBar: MatSnackBar,
    public location: Location

  ) {
    this.addForm = fb.group({})
    this.rows = this.fb.array([]);
    this.addForm.addControl('rows', this.rows);
  }

  addForm: FormGroup;
  rows: any;

  title = "Details d'achat..."
  items: any = []
  ID_ACHAT_GET: any = 0
  ID_FOURNISSEUR_GET: any = 0

  FournisseurGet: any;

  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_ACHAT_GET = this.activeroute.snapshot.params['id'];
    // console.log(this.ID_ACHAT_GET);
    this.getOneFournisseurAchat();
    this.getItemAchat();
  }


  getItemAchat() {
    this.purchaseService.getDetailPurchaseItems(this.ID_ACHAT_GET).subscribe({
      next: (data) => {
        data.forEach(item => {
          this.rows.push(this.createItemFormGroup(item));
        });
      }
    })

  }

  // GET Fournisseur
  getOneFournisseurAchat() {
    this.service.getList(LINK_BASE, T_FOURNISSEUR).subscribe({
      next: (data) => {
        this.FournisseurGet = data;
        // console.log(data)
      }
    })

  }

  createItemFormGroup(item: any): FormGroup {
    let montant = item.poids_achat * item.prix_unit_achat;
    return this.fb.group({
      id: new FormControl<number>(item.id,),
      // slug: new FormControl<number>(item.slug, [Validators.required,]),
      poids_achat: new FormControl<number>(item.poids_achat, [Validators.required,]),
      // date_achat: new FormControl<Date>(item.created_at, [Validators.required,]),
      // montant_achat: new FormControl<number>(montant, [Validators.required,]),
      carrat_achat: new FormControl<number>(item.carrat_achat, [Validators.required,]),
      // prix_unit_achat: new FormControl<number>(item.prix_unit_achat, [Validators.required,]),
      manquant: new FormControl<number>(item.manquant, [Validators.required,]),
    })
  }

  oldValueM: any;
  oldValueP: any;
  newRowsUpdate: any[] = [];

  updateDirectRow(row: any) {
    // console.log("row",row,"oM",this.oldValueM,"oP",this.oldValueP);

    if (row.valid && (row.value.manquant !== this.oldValueM||row.value.poids_achat !== this.oldValueP)) {
      this.updateRowsPurchase(row.value);
    }
  }
  setOldValues(row:any){
    this.oldValueM = row.value.manquant;
    this.oldValueP = row.value.poids_achat;
  }
  updateRowsPurchase(value: any) {
    this.purchaseService.updateRowsPurchase(value)
      .subscribe({
        next: (response) => {
          this.snackBar.open("Mise à jour effctuée avec succès!", undefined, {
            duration: 1000,
            horizontalPosition: "right",
            verticalPosition: "top",
            panelClass: ['bg-success', 'text-white']

          });
        },
        error: (err) => {
          this.snackBar.open("Echec, Veuillez reessayer!", undefined, {
            duration: 1000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
            panelClass: ['bg-danger', 'text-white']
          })
        }
      })
  }
}
