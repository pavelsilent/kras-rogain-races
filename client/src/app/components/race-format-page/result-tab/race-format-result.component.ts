import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import {
  combineLatest,
  filter,
  firstValueFrom,
  lastValueFrom,
  map,
  Observable,
  of,
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
import { SetRaceStateDialogComponent } from '../../../dialogs/set-race-state/set-race-state-dialog.component';
import { RaceState } from '../../../models/enums/race-state.enum';
import { RaceCheckPointModel } from '../../../models/race-check-point.model';
import { RaceFormatResultModel } from '../../../models/race-format-result.model';
import { RaceFormatModel } from '../../../models/race-format.model';
import { RaceMemberModel } from '../../../models/race-member.model';
import { CosmicTimePipe } from '../../../utils/cosmic-time.pipe';
import { RussianDateTimePipe } from '../../../utils/russian-date-time.pipe';
import { exists, hasLength } from '../../../utils/utils';
import { FileService } from '../../core/file.service';
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
               NgIf,
               NgForOf,
               AsyncPipe,
               RussianDateTimePipe,
               NgStyle,
               CosmicTimePipe,
               MatIconModule,
               MatTooltip,
               MatIconButton,
               MatButton,
             ],
             templateUrl: './race-format-result.component.html',
             standalone: true,
             styleUrl: './race-format-result.component.css',
           })
export class RaceFormatResultComponent
  implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  result$: Observable<RaceFormatResultModel>;
  startDateTime$: Observable<LocalDateTime>;
  raceState$: Observable<RaceState>;
  leaderFinishDuration$: Observable<string>;
  attitudeProfile$: Observable<string>;
  distanceSchema$: Observable<string>;
  checkPoints$: Observable<RaceCheckPointModel[]>;

  @Input()
  format: RaceFormatModel;

  format$: Observable<RaceFormatModel>;
  detailRowCount$: Observable<number>;

  @Input()
  showAttitude: boolean = false;

  @Input()
  showDistanceSchema: boolean = false;

  fixedTable: boolean = false;

  topHeaderDef: string[] = [
    'paramsHeader',
    'timeDetailHeader',
    'checkPointsHeader',
    'placesHeader',
  ];

  checkPointsHeaderDef: string[] = [];
  raceDistanceHeaderDef: string[] = [];
  raceDistanceDiffHeaderDef: string[] = [];
  ascentHeaderDef: string[] = [];
  descentHeaderDef: string[] = [];
  raceSpeedHeaderDef: string[] = [];
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
  dataTableSpeedDef: string[] = [];
  dataTableMembersDef: string[] = [];

  membersDataSource = new MatTableDataSource<RaceMemberModel>();
  protected readonly raceStates = RaceState;

  constructor(
    private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog,
    public page: RaceFormatPageService, private fileService: FileService,
    private router: Router,
  ) {

    this.result$ = this.page.refresh$.pipe(
      startWith(null),
      switchMap(data => combineLatest([this.page.getRaceId(), this.page.getRaceFormatId()])),
      switchMap(([raceId, raceFormatId]) => this.service.getRaceFormatResult(raceId, raceFormatId)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.startDateTime$ = this.result$.pipe(map(value => value.startDateTime!));
    this.raceState$ = this.result$.pipe(map(value => value.state));
    this.attitudeProfile$ = this.result$.pipe(
      map(value => value.attitudeProfileFileId),
      filter(value => exists(value)),
      switchMap(id => this.fileService.download(id)),
    );
    this.distanceSchema$ = this.result$.pipe(
      map(value => value.distanceSchemaFileId),
      filter(value => exists(value)),
      switchMap(id => this.fileService.download(id)),
    );

    this.checkPoints$ = this.result$.pipe(map(format => {
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

      this.raceDistanceDiffHeaderDef = [
        'distanceDiffHeader',
        'emptyDiffHeader',
        ...checkPoints.map(checkPoint => 'checkPointDistanceDiff' + checkPoint.id),
      ];

      this.ascentHeaderDef = [
        'ascentHeader',
        'emptyAscentHeader',
        ...checkPoints.map(checkPoint => 'checkPointAscent' + checkPoint.id),
      ];

      this.descentHeaderDef = [
        'descentHeader',
        'emptyDescentHeader',
        ...checkPoints.map(checkPoint => 'checkPointDescent' + checkPoint.id),
      ];

      this.raceSpeedHeaderDef = [
        'speedHeader',
        'emptySpeedHeader',
        ...checkPoints.map(checkPoint => 'checkPointSpeed' + checkPoint.id),
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
      this.dataTableSpeedDef = [
        'speed-detail',
        ...checkPoints.map(checkPoint => 'athleteCheckPointSpeed' + checkPoint.id),
      ];
      this.dataTableMembersDef = [
        'members-detail',
        ...checkPoints.map(checkPoint => 'athleteCheckPointMembers' + checkPoint.id),
      ];

      return checkPoints;
    }), shareReplay({ bufferSize: 1, refCount: true }));

    this.leaderFinishDuration$ = this.result$.pipe(
      map(format => format.checkPoints.filter(value => value.isFinish)),
      filter(value => hasLength(value)),
      map(value => value.at(0)),
      map(value => value?.leaderDuration!),
    );

    this.result$.pipe(map(format => format.athletes))
        .subscribe(data => {
          this.membersDataSource.data = data;
          this.membersDataSource.paginator = this.paginator;
        });
  }

  ngOnInit(): void {
    if (!exists(this.format)) {
      this.format$ = this.page.getRaceFormat();
    } else {
      this.format$ = of(this.format);
    }
    this.detailRowCount$ = this.format$.pipe(map(x => this.getDetailRowCount(x)));
  }

  getCheckPointRaceTime(member: RaceMemberModel | undefined, checkPointId: number): string | undefined {
    return this.getMemberCheckPoint(member, checkPointId)?.raceDuration;
  }

  getCheckPointTime(member: RaceMemberModel | undefined, checkPointId: number): LocalDateTime | undefined {
    return this.getMemberCheckPoint(member, checkPointId)?.time;
  }

  getCheckPointDiffTime(member: RaceMemberModel | undefined, checkPointId: number): string | undefined {
    return this.getMemberCheckPoint(member, checkPointId)?.prevCheckPointDiffDuration;
  }

  getCheckPointSpeed(member: RaceMemberModel | undefined, checkPointId: number): number | undefined {
    if (member === undefined) {
      return undefined;
    }
    if (this.getCheckPointTime(member, checkPointId) === undefined) {
      return undefined;
    }
    return this.getMemberCheckPoint(member, checkPointId)?.diffSpeed;
  }

  getCheckPointMembers(member: RaceMemberModel | undefined, checkPointId: number): string | undefined {
    if (member === undefined) {
      return undefined;
    }
    return (this.getMemberCheckPoint(member, checkPointId)?.checkPointMembers ?? []).map(item => item.name).join(', ');
  }

  getCheckPointTimeExpired(member: RaceMemberModel | undefined, checkPointId: number): boolean {
    if (member === undefined) {
      return false;
    }
    return this.getMemberCheckPoint(member, checkPointId)?.checkTimeExpired ?? false;
  }

  getMemberCheckPoint(member: RaceMemberModel | undefined, checkPointId: number) {
    if (member === undefined) {
      return undefined;
    }
    return member.checkPoints?.find(value => value.id === checkPointId);
  }

  getDetailRowCount(format: RaceFormatModel) {
    if (!exists(format)) {
      return 3;
    }
    return format?.isTeamRace() ? 4 : 3;
  }

  onAddAthleteCheckPoint(row: RaceMemberModel) {
    firstValueFrom(combineLatest([
                                   this.page.getRaceId(),
                                   this.page.getRaceFormatId(),
                                   this.startDateTime$,
                                   this.checkPoints$,
                                 ]))
      .then(([raceId, raceFormatId, startDateTime, checkPoints]) => this.dialog.open(
        AddRaceAthleteCheckPointDialogComponent,
        {
          disableClose: true,
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

  onSetAthleteState(row: RaceMemberModel) {
    firstValueFrom(combineLatest([this.page.getRaceId(), this.page.getRaceFormatId()]))
      .then(([raceId, raceFormatId]) => this.dialog.open(SetAthleteStateDialogComponent, {
        disableClose: true,
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

  onSetRaceState(state: RaceState) {
    firstValueFrom(combineLatest([this.page.getRaceId(), this.page.getRaceFormatId(), this.page.getRaceFormat()]))
      .then(([raceId, raceFormatId, raceFormat]) =>
              this.dialog.open(SetRaceStateDialogComponent, {
                data: {
                  raceId: raceId,
                  raceFormatId: raceFormatId,
                  state: state,
                  stateDateTime: raceFormat.startDateTime,
                  customStateDateTime: state === RaceState.FINISHED ? raceFormat.finishDateTime : null,
                },
                width: '400px',
                disableClose: true,
              }))
      .then(dialogRef => lastValueFrom(dialogRef.afterClosed()))
      .then(value => {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      });
  }

  onToggleAttitudeProfileVisibility() {
    this.showAttitude = !this.showAttitude;
  }

  onToggleDistanceSchemaVisibility() {
    this.showDistanceSchema = !this.showDistanceSchema;
  }

  onToggleFixedTable() {
    this.fixedTable = !this.fixedTable;
  }

  getShortFIO(row: RaceMemberModel, isAnon: boolean) {
    if (isAnon) {
      return 'Неизвестный атлет';
    }
    return row.member.name;
  }
}
