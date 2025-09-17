import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiserviceService } from 'src/app/api_service/apiservice.service';
import { FixingClientDialogComponent } from 'src/app/etat-entreprise/fixing-client-dialog/fixing-client-dialog.component';

@Component({
  selector: 'app-update-fixing',
  templateUrl: './update-fixing.component.html',
  styleUrls: ['./update-fixing.component.css'],
})
export class UpdateFixingComponent implements OnInit {
  updateFixingClient = new FormGroup({
    id: new FormControl(),
    res_poids: new FormControl('',[Validators.required]),
    res_carrat: new FormControl('',[Validators.required]),
  });

  constructor(
    private service: ApiserviceService,
    public dialogRef: MatDialogRef<FixingClientDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateFixingClient.patchValue({ id: this.data.id });
  }

  InfoFixing: any = []
  getList(): void {
    this.service.LIST_BY_ID('client', 'getOneFixing.php', this.data.id).subscribe({
      next: (data: any) => {
        // console.log('Fixing One : ', data)
        this.InfoFixing = data
      },
      error: (err: any) => console.log('erreur : ', err),
    });
  }

  ngOnInit(): void {
    // console.log('ID Fixing reçu :', this.data.id);
    this.getList()
  }

  saveData() {
    if (this.updateFixingClient.valid) {
      this.dialogRef.close({
        event: 'insert',
        data: this.updateFixingClient.value,
      });
    }
  }
}
