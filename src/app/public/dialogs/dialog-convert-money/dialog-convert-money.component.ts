import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogAddClientComponent } from '../dialog-add-client/dialog-add-client.component';

@Component({
  selector: 'app-dialog-convert-money',
  templateUrl: './dialog-convert-money.component.html',
  styleUrls: ['./dialog-convert-money.component.css']
})
export class DialogConvertMoneyComponent implements OnInit {


  // MISE A JOUR FIxiNG
  convertisseur = new FormGroup({
    deviseSource: new FormControl([Validators.required]),
    destinationDevise: new FormControl(),
    montant: new FormControl(Validators.required),
    taux: new FormControl(Validators.required),
    created_by: new FormControl(1)
  })

  constructor(
    public dialogRef: MatDialogRef<DialogAddClientComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit(): void {
  }


  convertir() {
    if (this.convertisseur.valid) {
      this.dialogRef.close({
        event: "convertir",
        data: this.convertisseur.value
      })
    }
  }

  selectDevise(valueSource: any): void {
    if(valueSource){
      // console.log(value);
      let inputDest: any = document.getElementById('dest')
      let labelDest: any = document.getElementById('labelDest')
      if(valueSource == 1) {
        inputDest.value = 2
        labelDest.innerText = 'EN : Dollar (USD)'
      }else{
        inputDest.value = 1
        labelDest.innerText = 'EN : Francs Guineen'
      }

    }
  }

}
