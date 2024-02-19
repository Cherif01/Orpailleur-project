import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CaisseOptDialogComponent } from '../caisse-opt-dialog-entrer/caisse-opt-dialog.component';

@Component({
  selector: 'app-operation-client',
  templateUrl: './operation-client.component.html',
  styleUrls: ['./operation-client.component.css']
})
export class OperationClientComponent implements OnInit {

  clientOperation = new FormGroup({
    idClient:new FormControl(null),
    operation:new FormControl('',[Validators.required]),
    montant:new FormControl(0, [Validators.required]),
    montant_anterieur:new FormControl(),
    motif:new FormControl(null),
  });

  constructor(
    public dialogRef: MatDialogRef<OperationClientComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  saveData(){
    if(this.clientOperation.valid){
      this.dialogRef.close({
        event:"insert",
        data:this.clientOperation.value
      })
    }
  }

}
