import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-deck-name-dialog',
  templateUrl: './edit-deck-name-dialog.component.html',
  styleUrls: ['./edit-deck-name-dialog.component.scss']
})
export class EditDeckNameDialogComponent implements OnInit {

  data: any = {};

  constructor(
    public dialogRef: MatDialogRef<EditDeckNameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any

  ) {
    this.data = incomingData || {};
  }

  ngOnInit() {
  }

  public onSave(): void {
    this.dialogRef.close(this.data.deckName);
  }

  public onCancel(): void {
    this.dialogRef.close();
  }

  public onClose(): void {
    this.dialogRef.close();
}

}
