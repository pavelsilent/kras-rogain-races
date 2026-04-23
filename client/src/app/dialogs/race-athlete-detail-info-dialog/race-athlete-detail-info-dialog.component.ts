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
import { AthleteType } from '../../models/enums/athlete-type.enum';
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
  dataTableBodyDef2: string[] = [
    'checkPoint2',
    'distance2',
    'raceTime2',
    'checkPointCheckTime2',
    'checkPointLeaderTime2',
  ];
  membersBodyDef: string[] = ['memberLabel', 'members'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: RaceAthleteDetailInfoDialogConfig) {
  }

  getAthleteCheckPoint(checkPointId: number) {
    return this.data.athleteInfo.checkPoints?.find(value => value.id === checkPointId);
  }

  getRaceCheckPoint(checkPointId: number) {
    return this.data.checkPoints.find(value => value.id === checkPointId);
  }

  getCheckPointRaceDuration(checkPointId: number): string | undefined {
    return this.getAthleteCheckPoint(checkPointId)?.raceDuration;
  }

  getCheckPointRaceDateTime(checkPointId: number): LocalDateTime | undefined {
    return this.getAthleteCheckPoint(checkPointId)?.time;
  }

  getCheckPointCheckTimeExpired(checkPointId: number): boolean | undefined {
    return this.getAthleteCheckPoint(checkPointId)?.checkTimeExpired;
  }

  getCheckPointDiffTime(checkPointId: number): string | undefined {
    return this.getAthleteCheckPoint(checkPointId)?.prevCheckPointDiffDuration;
  }

  getCheckPointLeaderTime(checkPointId: number): string | undefined {
    return this.getRaceCheckPoint(checkPointId)?.leaderDuration;
  }

  getCheckPointLeaderDateTime(checkPointId: number): LocalDateTime | undefined {
    return this.getRaceCheckPoint(checkPointId)?.leaderTime;
  }

  getCheckPointLeaderDiffTime(checkPointId: number): string | undefined {
    return this.getRaceCheckPoint(checkPointId)?.leaderDiffDuration;
  }

  getCheckPointCheckTime(checkPointId: number): string | undefined {
    return this.getRaceCheckPoint(checkPointId)?.checkDuration;
  }

  getCheckPointCheckDateTime(checkPointId: number): LocalDateTime | undefined {
    return this.getRaceCheckPoint(checkPointId)?.checkTime;
  }

  getCheckPointMembers(checkPointId: number): string | undefined {
    return this.getAthleteCheckPoint(checkPointId)?.checkPointMembers
               .map(value => value.name).join(', ');
  }

  isMembersHidden(row: RaceCheckPointModel) {
    if (this.data.athleteInfo.type === AthleteType.ATHLETE) {
      return true;
    }
    return !row.open;
  }

  cancel() {
    this.dialogRef.close();
  }
}
