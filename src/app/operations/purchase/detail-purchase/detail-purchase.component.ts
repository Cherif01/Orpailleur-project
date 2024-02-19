import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { ActivatedRoute } from '@angular/router';
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
    private fb: FormBuilder,
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

  ngOnInit(): void {
    // ID ACHAT EN GET
    this.ID_ACHAT_GET = this.activeroute.snapshot.params['id'];
    // console.log(this.ID_ACHAT_GET);
    // this.getOneFournisseurAchat();
    this.getItemAchat();
  }


  getItemAchat() {
    this.service.getUnique('achat', 'getItem.php', this.ID_ACHAT_GET)
      .subscribe({
        next: (data) => {
          data.forEach(item => {
            this.rows.push(this.createItemFormGroup(item));
          });
        }
      })
  }

  createItemFormGroup(item: any): FormGroup {
    return this.fb.group({
      id: new FormControl<number>(item.id,),
      poidsItem: new FormControl<number>(item.poidsItem, [Validators.required,]),
      carratItem: new FormControl<number>(item.e, [Validators.required,]),
      manquantItem: new FormControl<number>(item.manquantItem, [Validators.required,]),
    })
  }

  oldValueM: any;
  oldValueP: any;
  newRowsUpdate: any[] = [];

  updateDirectRow(row: any) {
    // console.log("row",row,"oM",this.oldValueM,"oP",this.oldValueP);
    if (row.valid && (row.value.manquantItem !== this.oldValueM || row.value.poidsItem !== this.oldValueP)) {
      this.updateRowsPurchase(row.value);
    }
  }

  setOldValues(row: any) {
    this.oldValueM = row.value.manquantItem;
    this.oldValueP = row.value.poidsItem;
  }
  updateRowsPurchase(value: any) {
    // console.log(value);

    this.service.UpdateItem('achat', 'updateItem.php',value)
      .subscribe({
        next: (response) => {
          this.snackBar.open("Mise à jour effctuée avec succès!", undefined, {
            duration: 1000,
            horizontalPosition: "right",
            verticalPosition: "bottom",
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
