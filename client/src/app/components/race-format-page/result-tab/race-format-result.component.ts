import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
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
import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import {
  combineLatest,
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import {
  AddRaceAthleteCheckPointDialogComponent,
} from '../../../dialogs/add-race-athlete-check-point-dialog/add-race-athlete-check-point-dialog.component';
import {
  SetAthleteStateDialogComponent,
} from '../../../dialogs/set-athlete-state-dialog/set-athlete-state-dialog.component';
import { RaceState } from '../../../models/enums/race-state.enum';
import { RaceAthleteModel } from '../../../models/race-athlete.model';
import { RaceCheckPointModel } from '../../../models/race-check-point.model';
import { RaceFormatResultModel } from '../../../models/race-format-result.model';
import { CosmicTimePipe } from '../../../utils/cosmic-time.pipe';
import { RussianDateTimePipe } from '../../../utils/russian-date-time.pipe';
import { RussianTimePipe } from '../../../utils/russian-time.pipe';
import { hasLength } from '../../../utils/utils';
import { RaceService } from '../../race/race.service';
import { RaceFormatPageService } from '../race-format-page.service';

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
               MatButton,
             ],
             templateUrl: './race-format-result.component.html',
             standalone: true,
             styleUrl: './race-format-result.component.css',
           })
export class RaceFormatResultComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  format$: Observable<RaceFormatResultModel>;
  startDateTime$: Observable<LocalDateTime>;
  raceState$: Observable<RaceState>;
  leaderFinishDuration$: Observable<string>;


  checkPoints$: Observable<RaceCheckPointModel[]>;

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

  constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog,
              public page: RaceFormatPageService,
  ) {
    this.format$ = this.page.refresh$.pipe(
      startWith(null),
      switchMap(data => combineLatest([this.page.getRaceId(), this.page.getRaceFormatId()])),
      switchMap(([raceId, raceFormatId]) => this.service.getRaceFormatResult(raceId, raceFormatId)
                                                .pipe(shareReplay(1))),
    );

    this.startDateTime$ = this.format$.pipe(map(value => value.startDateTime!));
    this.raceState$ = this.format$.pipe(map(value => value.state));

    this.checkPoints$ = this.format$.pipe(map(format => {
      console.log('***');
      const checkPoints = Option.of(format.checkPoints).getOrElse([]);
      this.checkPointsHeaderDef = [
        ...checkPoints.map(checkPoint => 'checkPointHeader' + checkPoint.id),
      ];

      this.raceDistanceHeaderDef = [
        'distanceHeader',
        'emptyHeader',
        ...checkPoints.map(checkPoint => 'checkPointDistance' + checkPoint.id),
        'emptyHeaderRowSpan4',
        'emptyHeaderRowSpan4',
      ];
      // КВ
      this.raceCheckTimeHeaderDef = [
        'checkTimeHeader',
        'checkTimeDetailHeader',
        ...checkPoints.map(checkPoint => 'checkPointTime' + checkPoint.id),
      ];

      this.raceLeaderHeaderDef = [
        'leaderTimeHeader',
        'leaderTimeDetailHeader',
        ...checkPoints.map(
          checkPoint => 'leaderCheckPointTime' + checkPoint.id),
      ];

      this.raceLeaderDiffTimeHeaderDef = [
        'leaderDiffTimeHeader',
        ...checkPoints.map(
          checkPoint => 'leaderCheckPointDiffTime' + checkPoint.id),
      ];

      this.dataTableBodyDef = [
        'bib',
        'name',

        'timeDetail',
        ...checkPoints.map(checkPoint => 'athleteCheckPoint' + checkPoint.id),
        'absolutePlace',
        'groupPlace',
      ];

      this.dataTableDiffDef = [
        'time-diff-detail',
        ...checkPoints.map(checkPoint => 'athleteCheckPointDiffTime' + checkPoint.id),
      ];
      return checkPoints;
    }), shareReplay(1));

    // this.format$.subscribe(format => {
    //   console.log('***');
    //   this.checkPoints = Option.of(format.checkPoints).getOrElse([]);
    //   this.checkPointsCount = this.checkPoints.length;
    //
    //   this.checkPointsHeaderDef = [
    //     ...this.checkPoints.map(checkPoint => 'checkPointHeader' + checkPoint.id),
    //   ];
    //
    //   this.raceDistanceHeaderDef = [
    //     'distanceHeader',
    //     'emptyHeader',
    //     ...this.checkPoints.map(checkPoint => 'checkPointDistance' + checkPoint.id),
    //     'emptyHeaderRowSpan4',
    //     'emptyHeaderRowSpan4',
    //   ];
    //   // КВ
    //   this.raceCheckTimeHeaderDef = [
    //     'checkTimeHeader',
    //     'checkTimeDetailHeader',
    //     ...this.checkPoints.map(checkPoint => 'checkPointTime' + checkPoint.id),
    //   ];
    //
    //   this.raceLeaderHeaderDef = [
    //     'leaderTimeHeader',
    //     'leaderTimeDetailHeader',
    //     ...this.checkPoints.map(
    //       checkPoint => 'leaderCheckPointTime' + checkPoint.id),
    //   ];
    //
    //   this.raceLeaderDiffTimeHeaderDef = [
    //     'leaderDiffTimeHeader',
    //     ...this.checkPoints.map(
    //       checkPoint => 'leaderCheckPointDiffTime' + checkPoint.id),
    //   ];
    //
    //   this.dataTableBodyDef = [
    //     'bib',
    //     'name',
    //
    //     'timeDetail',
    //     ...this.checkPoints.map(checkPoint => 'athleteCheckPoint' + checkPoint.id),
    //     'absolutePlace',
    //     'groupPlace',
    //   ];
    //
    //   this.dataTableDiffDef = [
    //     'time-diff-detail',
    //     ...this.checkPoints.map(checkPoint => 'athleteCheckPointDiffTime' + checkPoint.id),
    //   ];
    // });

    this.leaderFinishDuration$ = this.format$.pipe(
      map(format => format.checkPoints.filter(value => value.isFinish)),
      filter(value => hasLength(value)),
      map(value => value.at(0)),
      map(value => value?.leaderDuration!),
    );

    this.format$.pipe(map(format => format.athletes))
        .subscribe(data => {
          this.membersDataSource.data = data;
          this.membersDataSource.paginator = this.paginator;
        });
  }

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

  getCheckPointDiffTime(member: RaceAthleteModel | undefined, checkPointId: number): string | undefined {
    if (member === undefined) {
      return undefined;
    }
    return member.checkPoints?.find(value => value.id === checkPointId)?.prevCheckPointDiffDuration;
  }

  getCheckPointTimeExpired(member: RaceAthleteModel | undefined, checkPointId: number): boolean {
    if (member === undefined) {
      return false;
    }
    return member.checkPoints?.find(value => value.id === checkPointId)?.checkTimeExpired ?? false;
  }

  onAddAthleteCheckPoint(row: RaceAthleteModel) {
    firstValueFrom(combineLatest([
                                   this.page.getRaceId(),
                                   this.page.getRaceFormatId(),
                                   this.startDateTime$,
                                   this.checkPoints$,
                                 ]))
      .then(([raceId, raceFormatId, startDateTime, checkPoints]) => this.dialog.open(
        AddRaceAthleteCheckPointDialogComponent,
        {
          data: {
            raceId: raceId,
            raceFormatId: raceFormatId,
            checkPoints: checkPoints,
            raceDate: startDateTime?.toLocalDate(),
            athleteBibNumber: row.bibNumber,
          },
          width: '400px',
        },
      ))
      .then(dialogRef => lastValueFrom(dialogRef.afterClosed()))
      .then(value => this.page.refresh$.next());
  }

  onSetAthleteState(row: RaceAthleteModel) {
    firstValueFrom(combineLatest([this.page.getRaceId(), this.page.getRaceFormatId()]))
      .then(([raceId, raceFormatId]) => this.dialog.open(SetAthleteStateDialogComponent, {
        data: {
          raceId: raceId,
          raceFormatId: raceFormatId,
          athleteBibNumber: row.bibNumber,
        },
        width: '400px',
      }))
      .then(dialogRef => lastValueFrom(dialogRef.afterClosed()))
      .then(value => this.page.refresh$.next());
  }

  protected readonly RaceState = RaceState;
}
