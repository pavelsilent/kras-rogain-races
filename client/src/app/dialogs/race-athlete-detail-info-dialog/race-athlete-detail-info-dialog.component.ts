import { NgClass, NgIf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { LocalDateTime } from '@js-joda/core';
import { RaceCheckPointModel } from '../../models/race-check-point.model';
import { RaceMemberModel } from '../../models/race-member.model';
import { RussianDateTimePipe } from '../../utils/russian-date-time.pipe';

export interface RaceAthleteDetailInfoDialogConfig {
  checkPoints: RaceCheckPointModel[],
  athleteInfo: RaceMemberModel,
}

@Component({
             selector: 'app-race-athlete-detail-info-dialog',
             imports: [
               FormsModule,
               MatButton,
               MatDialogActions,
               MatDialogContent,
               MatDialogTitle,
               ReactiveFormsModule,
               MatCell,
               MatCellDef,
               MatColumnDef,
               MatHeaderCell,
               MatHeaderRow,
               MatHeaderRowDef,
               MatRowDef,
               MatTable,
               NgIf,
               MatHeaderCellDef,
               MatRow,
               NgClass,
               RussianDateTimePipe,
             ],
             templateUrl: './race-athlete-detail-info-dialog.component.html',
             styleUrl: './race-athlete-detail-info-dialog.component.css',
             standalone: true,
           })
export class RaceAthleteDetailInfoDialogComponent {
  dialogRef = inject(MatDialogRef<RaceAthleteDetailInfoDialogComponent>);
  dataTableBodyDef: string[] = ['checkPoint', 'distance', 'raceTime', 'checkPointCheckTime', 'checkPointLeaderTime'];
  localTime = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: RaceAthleteDetailInfoDialogConfig) {
  }

  onToggleLocalTime() {
    this.localTime = !this.localTime;
  }

  getCheckPointRaceDuration(checkPointId: number): string | undefined {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId)?.raceDuration;
  }

  getCheckPointRaceDateTime(checkPointId: number): LocalDateTime | undefined {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId)?.time;
  }

  getCheckPointCheckTimeExpired(checkPointId: number): boolean | undefined {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId)?.checkTimeExpired;
  }

  getCheckPointDiffTime(checkPointId: number): string | undefined {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId)?.prevCheckPointDiffDuration;
  }

  getCheckPointLeaderTime(checkPointId: number): string | undefined {
    return this.data.checkPoints.find(value => value.id === checkPointId)?.leaderDuration
  }

  getCheckPointLeaderDateTime(checkPointId: number): LocalDateTime | undefined {
    return this.data.checkPoints.find(value => value.id === checkPointId)?.leaderTime;
  }

  getCheckPointLeaderDiffTime(checkPointId: number): string | undefined {
    return this.data.checkPoints.find(value => value.id === checkPointId)?.leaderDiffDuration
  }

  getCheckPointCheckTime(checkPointId: number): string | undefined {
    return this.data.checkPoints.find(value => value.id === checkPointId)?.checkDuration
  }

  getCheckPointCheckDateTime(checkPointId: number): LocalDateTime | undefined {
    return this.data.checkPoints.find(value => value.id === checkPointId)?.checkTime
  }

  cancel() {
    this.dialogRef.close();
  }
}
