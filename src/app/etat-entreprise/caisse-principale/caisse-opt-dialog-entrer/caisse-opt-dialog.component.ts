import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaisseDialogComponent } from '../caisse-dialog/caisse-dialog.component';

@Component({
  selector: 'app-caisse-opt-dialog',
  templateUrl: './caisse-opt-dialog.component.html',
  styleUrls: ['./caisse-opt-dialog.component.css']
})
export class CaisseOptDialogComponent implements OnInit {

  form = new FormGroup({
    operation:new FormControl([Validators.required]),
    fournisseur:new FormControl(null),
    devise:new FormControl([Validators.required]),
    montant:new FormControl([Validators.required]),
    montant_anterieur:new FormControl(),
    motif:new FormControl(""),
    created_by:new FormControl(1)
  });

  constructor(
    public dialogRef: MatDialogRef<CaisseOptDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  saveData(){
    if(this.form.valid){
      this.dialogRef.close({
        event:"insert",
        data:this.form.value
      })
    }
  }

}
