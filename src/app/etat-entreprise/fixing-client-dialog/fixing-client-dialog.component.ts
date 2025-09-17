import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';

@Component({
  selector: 'app-fixing-client-dialog',
  templateUrl: './fixing-client-dialog.component.html',
  styleUrls: ['./fixing-client-dialog.component.css'],
})
export class FixingClientDialogComponent implements OnInit {
  fixingClient = new FormGroup({
    idClient: new FormControl(null),
    id_InitExpedition: new FormControl(null),
    fixingBourse: new FormControl(0, [Validators.required]),
    discompte: new FormControl(0, [Validators.required]),
    poids_vendu: new FormControl(),
    carrat_vendu: new FormControl(),
    typeVente: new FormControl('', [Validators.required]),
  });

  constructor(
    private service: ApiserviceService,
    public dialogRef: MatDialogRef<FixingClientDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data?.idClient) {
      this.fixingClient.patchValue({ idClient: data.idClient });
    }
  }

  ngOnInit(): void {
    // console.log('ID Client reçu :', this.fixingClient.value.idClient);
    this.getList();
  }

  saveData() {
    if (this.fixingClient.valid) {
      this.dialogRef.close({
        event: 'insert',
        data: this.fixingClient.value,
      });
    }
  }

  selectedExpedition: any = null;

  onExpeditionChange(event: any): void {
    const selectedId = event.value;
    this.selectedExpedition = this.Tab.find((exp: any) => exp.id === selectedId);
  }

  Tab: any = [];
  getList(): void {
    this.service
      .LIST_BY_ID(
        'client',
        'getListeExpeditionRestant.php',
        this.fixingClient.value.idClient
      )
      .subscribe({
        next: (data: any) => {
          // console.log('Liste expedition poids 2 : ', data)
          data.forEach((element: any) => {
            if (element.Poids_restant > 0) this.Tab.push(element);
          });
        },
        error: (err: any) => console.log('erreur : ', err),
      });
  }
}
