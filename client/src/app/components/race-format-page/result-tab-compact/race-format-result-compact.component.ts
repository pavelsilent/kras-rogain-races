import { AsyncPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
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
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import {
  combineLatest,
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
  RaceAthleteDetailInfoDialogComponent,
} from '../../../dialogs/race-athlete-detail-info-dialog/race-athlete-detail-info-dialog.component';
import {
  SetAthleteStateDialogComponent,
} from '../../../dialogs/set-athlete-state-dialog/set-athlete-state-dialog.component';
import { SetRaceStateDialogComponent } from '../../../dialogs/set-race-state/set-race-state-dialog.component';
import { RaceState } from '../../../models/enums/race-state.enum';
import { RaceAthleteModel } from '../../../models/race-athlete.model';
import { RaceCheckPointModel } from '../../../models/race-check-point.model';
import { RaceFormatResultModel } from '../../../models/race-format-result.model';
import { RaceFormatModel } from '../../../models/race-format.model';
import { CosmicTimePipe } from '../../../utils/cosmic-time.pipe';
import { RussianDateTimePipe } from '../../../utils/russian-date-time.pipe';
import { RussianTimePipe } from '../../../utils/russian-time.pipe';
import { FileService } from '../../core/file.service';
import { RaceService } from '../../race/race.service';
import { RaceFormatPageService } from '../race-format-page.service';

@Component({
             selector: 'app-race-format-result-compact',
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
             templateUrl: './race-format-result-compact.component.html',
             standalone: true,
             styleUrl: './race-format-result-compact.component.css',
           })
export class RaceFormatResultCompactComponent {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  result$: Observable<RaceFormatResultModel>;
  startDateTime$: Observable<LocalDateTime>;
  raceState$: Observable<RaceState>;
  checkPoints$: Observable<RaceCheckPointModel[]>;
  protected readonly raceStates = RaceState;
  @Input()
  format: RaceFormatModel;

  @Input()
  showAttitude: boolean;

  @Input()
  showDistanceSchema: boolean;

  dataTableBodyDef: string[] = ['name'];

  membersDataSource = new MatTableDataSource<RaceAthleteModel>();

  constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog,
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

    this.result$.pipe(map(format => format.athletes))
        .subscribe(data => {
          this.membersDataSource.data = data;
          this.membersDataSource.paginator = this.paginator;
        });

    this.checkPoints$ = this.result$.pipe(map(result => Option.of(result.checkPoints).getOrElse([])));
  }

  getCheckPointTimeExpired(athlete: RaceAthleteModel | undefined): boolean {
    if (athlete === undefined) {
      return false;
    }
    return athlete.lastRaceAthleteCheckPoint.checkTimeExpired;
  }

  onShowAthleteDetailInfo(row: RaceAthleteModel) {
    firstValueFrom(this.checkPoints$)
      .then((checkPoints) => this.dialog.open(
        RaceAthleteDetailInfoDialogComponent,
        {
          disableClose: true,
          data: {
            checkPoints: checkPoints,
            athleteInfo: row,

          },
          width: '150px',       // 80% ширины окна
          panelClass: 'small-dialog',
          maxWidth: '150px',   // не больше всей ширины
          height: 'auto',
          maxHeight: '90vh',   // ограничим по высоте экрана
        },
      ));
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
          disableClose: true,
          data: {
            raceId: raceId,
            raceFormatId: raceFormatId,
            checkPoints: checkPoints,
            raceDate: startDateTime?.toLocalDate(),
            athleteBibNumber: row.bibNumber,
          },
          width: '400px',
          panelClass: 'small-dialog',
        },
      ))
      .then(dialogRef => lastValueFrom(dialogRef.afterClosed()))
      .then(value => this.page.refresh$.next());
  }

  onSetAthleteState(row: RaceAthleteModel) {
    firstValueFrom(combineLatest([this.page.getRaceId(), this.page.getRaceFormatId()]))
      .then(([raceId, raceFormatId]) => this.dialog.open(SetAthleteStateDialogComponent, {
        disableClose: true,
        data: {
          raceId: raceId,
          raceFormatId: raceFormatId,
          athleteBibNumber: row.bibNumber,
        },
        width: '400px',
        panelClass: 'small-dialog',
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
                },
                width: '400px',
                panelClass: 'small-dialog',
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

}
