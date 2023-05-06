import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OperationsService } from 'src/app/operations/operations.service';

@Component({
  selector: 'app-caisse-dialog',
  templateUrl: './caisse-dialog.component.html',
  styleUrls: ['./caisse-dialog.component.css']
})
export class CaisseDialogComponent implements OnInit {

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
    public dialogRef: MatDialogRef<CaisseDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,

    //
    private serviceOperation: OperationsService
  ) { }

  ngOnInit(): void {
    this.getFournisseur()
  }

  saveData(){
    if(this.form.valid){
      this.dialogRef.close({
        event:"insert",
        data:this.form.value
      })
    }
  }

  // GetFourniseur
  ListFrs: any = []
  getFournisseur(): void {
    this.serviceOperation.getList('api', 'fournisseur').subscribe({
      next: (data: any) => {
        // console.log(data),
        this.ListFrs = data
      },
      error: (err: any) => console.log(err)
    })
  }

  isTrue: any = false
  vendorChoice(select: any): void {
    if(select == 3 || select == 4){
      this.isTrue = true
    }else{
      this.isTrue = false
    }
  }

}
