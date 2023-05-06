import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-message',
  templateUrl: './dialog-message.component.html',
  styleUrls: ['./dialog-message.component.css']
})
export class DialogMessageComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogMessageComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: dialogData,
  ) { }

    get title(): string {
      return this.data.title;
    }
    get message(): string {
      return this.data.message;
    }
    get messageNo() {
      return this.data?.messageNo;
    }
    get messageYes() {
      return this.data.messageYes;
    }

    closeDialog(yesNo: boolean) {
      this.dialogRef.close(yesNo);
    }
}

export interface dialogData{
  title: string;
  message: string;
  messageNo?:string;
  messageYes:string;
}
