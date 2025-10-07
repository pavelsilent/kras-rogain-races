import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSort } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { LocalDateTime } from '@js-joda/core';
import { RaceAthleteModel } from '../../models/race-athlete.model';
import { RaceCheckPointModel } from '../../models/race-check-point.model';
import { RussianTimePipe } from '../../utils/russian-time.pipe';

export interface RaceAthleteDetailInfoDialogConfig {
  checkPoints: RaceCheckPointModel[],
  athleteInfo: RaceAthleteModel,
}

@Component({
             selector: 'app-race-athlete-detail-info-dialog',
             imports: [
               FormsModule,
               MatButton,
               MatDialogActions,
               MatDialogContent,
               MatDialogTitle,
               MatFormField,
               MatInput,
               MatLabel,
               ReactiveFormsModule,
               AsyncPipe,
               MatCell,
               MatCellDef,
               MatColumnDef,
               MatHeaderCell,
               MatHeaderRow,
               MatHeaderRowDef,
               MatIcon,
               MatIconButton,
               MatRowDef,
               MatSort,
               MatTable,
               MatTooltip,
               NgForOf,
               NgIf,
               RussianTimePipe,
               MatHeaderCellDef,
             ],
             templateUrl: './race-athlete-detail-info-dialog.component.html',
             styleUrl: './race-athlete-detail-info-dialog.component.css',
             standalone: true,
           })
export class RaceAthleteDetailInfoDialogComponent {
  dialogRef = inject(MatDialogRef<RaceAthleteDetailInfoDialogComponent>);
  dataTableBodyDef: string[] = ['checkPoint', 'distance', 'raceTime', 'prevCheckPointDiff'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: RaceAthleteDetailInfoDialogConfig) {
  }

  getCheckPointRaceTime(checkPointId: number): LocalDateTime | undefined {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId)?.raceTime;
  }

  getCheckPointTime(checkPointId: number): LocalDateTime | undefined {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId)?.time;
  }

  getCheckPointDiffTime(checkPointId: number): string | undefined {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId)?.prevCheckPointDiffDuration;
  }

  cancel() {
    this.dialogRef.close();
  }
}
