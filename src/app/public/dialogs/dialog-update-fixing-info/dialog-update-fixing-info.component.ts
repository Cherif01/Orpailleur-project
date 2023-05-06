import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-update-fixing-info',
  templateUrl: './dialog-update-fixing-info.component.html',
  styleUrls: ['./dialog-update-fixing-info.component.css']
})
export class DialogUpdateFixingInfoComponent implements OnInit {

  // MISE A JOUR FIxiNG
  form = new FormGroup({
    created_by: new FormControl(1)
  })

  constructor(
    public dialogRef: MatDialogRef<DialogUpdateFixingInfoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  ngOnInit(): void {
  }

  saveDataFix() {
    if (this.form.valid) {
      this.dialogRef.close({
        event: "update",
        data: this.form.value
      })
    }
  }

}
