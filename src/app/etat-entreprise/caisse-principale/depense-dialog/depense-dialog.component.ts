import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-depense-dialog',
  templateUrl: './depense-dialog.component.html',
  styleUrls: ['./depense-dialog.component.css']
})
export class DepenseDialogComponent implements OnInit {

  createdBy: any = localStorage.getItem('id')
  // local
    form = new FormGroup({
      operation:new FormControl([Validators.required]),
      devise:new FormControl(2),
      montant:new FormControl([Validators.required]),
      montant_anterieur: new FormControl(0),
      motif:new FormControl(""),
      created_by: new FormControl(this.createdBy)
    });
  
    constructor(
      public dialogRef: MatDialogRef<DepenseDialogComponent>,
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
