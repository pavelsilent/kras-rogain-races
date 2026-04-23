import { Component, Inject, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import { AthleteTeamListComponent } from '../../components/athlete-team-list/athlete-team-list.component';
import { AthleteTeamModel } from '../../models/athlete-team.model';

export interface SelectAthleteTeamDialogConfig {
  selectedTeamIds: number[];
}

@Component({
             selector: 'app-select-athlete-team-dialog',
             imports: [
               MatButton,
               MatDialogActions,
               AthleteTeamListComponent,
             ],
             templateUrl: './select-athlete-team-dialog.component.html',
             styleUrl: './select-athlete-team-dialog.component.css',
           })
export class SelectAthleteTeamDialogComponent {
  dialogRef = inject(MatDialogRef<SelectAthleteTeamDialogComponent>);
  selectedRow: AthleteTeamModel;

  constructor(@Inject(MAT_DIALOG_DATA) public data: SelectAthleteTeamDialogConfig) {
  }

  onSelect(row: AthleteTeamModel) {
    this.selectedRow = row;
  }

  submit() {
    this.dialogRef.close(this.selectedRow);
  }

  cancel() {
    this.dialogRef.close();
  }
}
