import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-add-client',
  templateUrl: './dialog-add-client.component.html',
  styleUrls: ['./dialog-add-client.component.css']
})
export class DialogAddClientComponent implements OnInit {

  // MISE A JOUR FIxiNG
  Client = new FormGroup({
    responsable: new FormControl('', Validators.required),
    raison_sociale: new FormControl('', Validators.required),
    pays: new FormControl(''),
    ville: new FormControl(''),
    adresse: new FormControl(''),
    email: new FormControl(''),
    telephone: new FormControl('', Validators.required),
    created_by: new FormControl(1)
  })

  constructor(
    public dialogRef: MatDialogRef<DialogAddClientComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }


  ngOnInit(): void {
  }


  saveDataClient() {
    if (this.Client.valid) {
      this.dialogRef.close({
        event: "insert",
        data: this.Client.value
      })
    }
  }

}
