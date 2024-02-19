import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-fixing-client-dialog',
  templateUrl: './fixing-client-dialog.component.html',
  styleUrls: ['./fixing-client-dialog.component.css']
})
export class FixingClientDialogComponent implements OnInit {

  fixingClient = new FormGroup({
    idClient: new FormControl(null),
    poidsFixer: new FormControl('', [Validators.required]),
    fixingBourse: new FormControl(0, [Validators.required]),
    discompte: new FormControl(0, [Validators.required]),
  });

  constructor(
    public dialogRef: MatDialogRef<FixingClientDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  saveData() {
    if (this.fixingClient.valid) {
      this.dialogRef.close({
        event: "insert",
        data: this.fixingClient.value
      })
    }
  }


}
