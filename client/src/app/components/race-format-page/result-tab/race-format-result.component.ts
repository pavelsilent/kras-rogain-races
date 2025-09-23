import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
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
  MatTableDataSource,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { LocalDate, LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import { lastValueFrom, map, Observable, shareReplay, Subject, switchMap } from 'rxjs';
import {
  AddRaceAthleteCheckPointDialogComponent,
  AddRaceAthleteCheckPointDialogResult,
} from '../../../dialogs/add-race-athlete-check-point-dialog/add-race-athlete-check-point-dialog.component';
import { RaceAthleteCheckPointModel } from '../../../models/race-athlete-check-point.model';
import { RaceAthleteModel } from '../../../models/race-athlete.model';
import { RaceCheckPointModel } from '../../../models/race-check-point.model';
import { RaceFormatResultModel } from '../../../models/race-format-result.model';
import { CosmicTimePipe } from '../../../utils/cosmic-time.pipe';
import { RussianDateTimePipe } from '../../../utils/russian-date-time.pipe';
import { RussianTimePipe } from '../../../utils/russian-time.pipe';
import { RaceService } from '../../race/race.service';

@Component({
             selector: 'app-race-format-result',
             imports: [
               MatColumnDef,
               MatHeaderCell,
               MatHeaderCellDef,
               MatCellDef,
               MatCell,
               MatHeaderRow,
               MatRow,
               NgClass,
               MatTable,
               MatSort,
               MatRowDef,
               MatHeaderRowDef,
               MatSortHeader,
               MatFormField,
               MatInput,
               NgIf,
               NgForOf,
               AsyncPipe,
               RussianDateTimePipe,
               RussianTimePipe,
               NgStyle,
               CosmicTimePipe,
               MatPaginator,
               MatIconModule,
               MatTooltip,
               MatIconButton,
             ],
             templateUrl: './race-format-result.component.html',
             standalone: true,
             styleUrl: './race-format-result.component.css',
           })
export class RaceFormatResultComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  format$: Observable<RaceFormatResultModel>;
  refresh$: Subject<void> = new Subject<void>();
  id: number;
  formatId: number;
  checkPoints: RaceCheckPointModel[] = [];
  checkPointsCount = 0;
  checkPointAthlete?: RaceAthleteModel;
  leaderAthlete?: RaceAthleteModel;

  topHeaderDef: string[] = [
    'paramsHeader',
    'timeDetailHeader',
    'checkPointsHeader',
    'placesHeader',
  ];

  checkPointsHeaderDef: string[] = [];
  raceDistanceHeaderDef: string[] = [];
  raceCheckTimeHeaderDef: string[] = [];
  raceLeaderHeaderDef: string[] = [];
  raceLeaderDiffTimeHeaderDef: string[] = [];
  dataTableHeaderDef: string[] = [
    'bibHeader',
    'nameHeader',
    'athletesTimeHeader',
    'absolutePlaceHeader',
    'groupPlaceHeader',
  ];

  dataTableBodyDef: string[] = [];
  dataTableDiffDef: string[] = [];

  membersDataSource = new MatTableDataSource<RaceAthleteModel>();

  constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog) {
    this.id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    this.formatId = Number(this.route.parent?.snapshot.paramMap.get('formatId'));
    this.format$ = this.refresh$.pipe(switchMap(data => this.service.getRaceFormatResult(this.id, this.formatId).pipe(
      shareReplay(1))));
    this.format$.subscribe(format => {

      this.checkPoints = Option.of(format.checkPoints).getOrElse([]);
      this.checkPointsCount = this.checkPoints.length;
      this.leaderAthlete = format.leader;
      this.checkPointAthlete = format.checkTime;

      this.checkPointsHeaderDef = [
        ...this.checkPoints.map(checkPoint => 'checkPointHeader' + checkPoint.id),
      ];

      this.raceDistanceHeaderDef = [
        'distanceHeader',
        'emptyHeader',
        ...this.checkPoints.map(checkPoint => 'checkPointDistance' + checkPoint.id),
        'emptyHeaderRowSpan4',
        'emptyHeaderRowSpan4',
      ];
      // КВ
      this.raceCheckTimeHeaderDef = [
        'checkTimeHeader',
        'checkTimeDetailHeader',
        ...this.checkPoints.map(checkPoint => 'checkPointTime' + checkPoint.id),
      ];

      this.raceLeaderHeaderDef = [
        'leaderTimeHeader',
        'leaderTimeDetailHeader',
        ...this.checkPoints.map(
          checkPoint => 'leaderCheckPointTime' + checkPoint.id),
      ];

      this.raceLeaderDiffTimeHeaderDef = [
        'leaderDiffTimeHeader',
        ...this.checkPoints.map(
          checkPoint => 'leaderCheckPointDiffTime' + checkPoint.id),
      ];

      this.dataTableBodyDef = [
        'bib',
        'name',

        'timeDetail',
        ...this.checkPoints.map(checkPoint => 'athleteCheckPoint' + checkPoint.id),
        'absolutePlace',
        'groupPlace',
      ];

      this.dataTableDiffDef = [
        'time-diff-detail',
        ...this.checkPoints.map(checkPoint => 'athleteCheckPointDiffTime' + checkPoint.id),
      ];
    });

    this.format$.pipe(map(format => format.athletes))
        .subscribe(data => {
          console.log('***');
          console.log(data);
          this.membersDataSource.data = data;
          this.membersDataSource.paginator = this.paginator;
        });

    this.refresh$.next();
  }

  getControlCheckPointRaceTime(checkPointId: number): LocalDateTime | undefined {
    return this.getCheckPointRaceTime(this.checkPointAthlete, checkPointId);
  }

  getControlCheckPointTime(checkPointId: number): LocalDateTime | undefined {
    return this.getCheckPointTime(this.checkPointAthlete, checkPointId);
  }

  getLeaderCheckPointRaceTime(checkPointId: number): LocalDateTime | undefined {
    return this.getCheckPointRaceTime(this.leaderAthlete, checkPointId);
  }

  getLeaderCheckPointTime(checkPointId: number): LocalDateTime | undefined {
    return this.getCheckPointTime(this.leaderAthlete, checkPointId);
  }

  getLeaderCheckPointDiffTime(checkPointId: number): LocalDateTime | undefined {
    return this.getCheckPointDiffTime(this.leaderAthlete, checkPointId);
  }

  // getLeaderCheckPointTime(checkPointId: number): LocalDateTime | undefined {
  //   return member.checkPoints?.find(value => value.id === checkPointId)?.time;
  // }

  getCheckPointRaceTime(member: RaceAthleteModel | undefined, checkPointId: number): LocalDateTime | undefined {
    if (member === undefined) {
      return undefined;
    }
    return member.checkPoints?.find(value => value.id === checkPointId)?.raceTime;
  }

  getCheckPointTime(member: RaceAthleteModel | undefined, checkPointId: number): LocalDateTime | undefined {
    if (member === undefined) {
      return undefined;
    }
    return member.checkPoints?.find(value => value.id === checkPointId)?.time;
  }

  getCheckPointDiffTime(member: RaceAthleteModel | undefined, checkPointId: number): LocalDateTime | undefined {
    if (member === undefined) {
      return undefined;
    }
    return member.checkPoints?.find(value => value.id === checkPointId)?.diffTime;
  }

  onAddCheckPoint(row: RaceAthleteModel) {
    const dialogRef =
      this.dialog.open(AddRaceAthleteCheckPointDialogComponent, {
        data: {
          checkPoints: this.checkPoints,
          raceDate: LocalDate.of(2025, 10, 19),
          athleteBibNumber: row.bibNumber,
        },
        width: '400px',
      });

    console.log('I\'m here');
    lastValueFrom(dialogRef.afterClosed())
      .then((result: AddRaceAthleteCheckPointDialogResult) => {
        console.log(typeof result.checkPointDateTime);

        let model = new RaceAthleteCheckPointModel();
        model.id = result?.checkPointId;
        model.athleteBibNumber = result.athleteBibNumber;
        model.time = result.checkPointDateTime;
        model.passed = true;

        return this.service.addRaceAthleteCheckPoint(this.id, this.formatId, model);
      })
      .then(value => {
        this.refresh$.next();
      });
  }
}
