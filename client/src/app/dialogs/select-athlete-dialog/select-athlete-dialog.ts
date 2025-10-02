import { Component, Inject, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { AthleteListComponent } from '../../components/athlete-list/athlete-list.component';
import { AthleteModel } from '../../models/athlete.model';

export interface SelectAthleteDialogConfig {
  selectedAthleteIds: number[];
}

@Component({
             selector: 'app-select-athlete-dialog',
             imports: [
               AthleteListComponent,
               MatButton,
               MatDialogActions,
             ],
             templateUrl: './select-athlete-dialog.html',
             standalone: true,
             styleUrl: './select-athlete-dialog.css',
           })
export class SelectAthleteDialog {
  dialogRef = inject(MatDialogRef<SelectAthleteDialog>);
  selectedRow: AthleteModel;

  constructor(@Inject(MAT_DIALOG_DATA) public data: SelectAthleteDialogConfig) {
  }

  onSelect(row: AthleteModel) {
    this.selectedRow = row;
  }

  submit() {
    this.dialogRef.close(this.selectedRow);
  }

  cancel() {
    this.dialogRef.close();
  }

}
