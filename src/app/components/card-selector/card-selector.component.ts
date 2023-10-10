import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Card } from 'src/app/model/Card';

@Component({
  selector: 'app-card-selector',
  templateUrl: './card-selector.component.html',
  styleUrls: ['./card-selector.component.scss']
})
export class CardSelectorComponent {

  constructor(
    public dialogRef: MatDialogRef<CardSelectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Card[]
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectCard(card: Card): void {
    this.dialogRef.close(card);
  }
}
