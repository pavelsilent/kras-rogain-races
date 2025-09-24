import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule, MatLabel } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
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
  MatTableModule,
} from '@angular/material/table';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom, lastValueFrom, startWith, Subject, switchMap } from 'rxjs';
import {
  AddRaceFormatCheckPointDialogComponent,
} from '../../../dialogs/add-race-format-check-point-dialog/add-race-format-check-point-dialog.component';
import { RaceCheckPointModel } from '../../../models/race-check-point.model';
import { BoolPipe } from '../../../utils/bool.pipe';
import { EnumPipe } from '../../../utils/enum.pipe';
import { RussianDateTimePipe } from '../../../utils/russian-date-time.pipe';
import { RussianDatePipe } from '../../../utils/russian-date.pipe';
import { RussianTimePipe } from '../../../utils/russian-time.pipe';
import { RaceService } from '../../race/race.service';
import { RaceFormatPageService } from '../race-format-page.service';

@Component({
             selector: 'app-race-format-check-points-tab',
             imports: [
               MatCell,
               MatCellDef,
               MatColumnDef,
               MatFormField,
               MatHeaderCell,
               MatHeaderRow,
               MatHeaderRowDef,
               MatInput,
               MatLabel,
               MatPaginator,
               MatRow,
               MatRowDef,
               MatSort,
               MatSortHeader,
               MatTable,
               RouterLink,
               MatHeaderCellDef,
               MatTableModule,
               MatPaginatorModule,
               MatSortModule,
               MatFormFieldModule,
               MatInputModule,
               RouterLink,
               RussianTimePipe,
               RussianDatePipe,
               EnumPipe,
               MatButton,
               MatDivider,
               BoolPipe,
               RussianDateTimePipe,
             ],
             templateUrl: './race-format-check-points-tab.component.html',
             standalone: true,
             styleUrl: './race-format-check-points-tab.component.css',
           })
export class RaceFormatCheckPointsTabComponent
  implements AfterViewInit {
  id: number;
  formatId: number;
  displayedColumns: string[] = [
    'order',
    'isStart',
    'isFinish',
    'name',
    'description',
    'totalDistance',
    'checkDuration',
    'leaderDuration',
  ];
  dataSource = new MatTableDataSource<RaceCheckPointModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  refresh$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog,
              private page: RaceFormatPageService,
  ) {
    this.id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    this.formatId = Number(this.route.parent?.snapshot.paramMap.get('formatId'));
    this.refresh$.pipe(
      startWith(null),
      switchMap(value => this.service.getRaceFormatsCheckPoints(this.id, this.formatId)),
    ).subscribe(data => {

      console.log(data);
      this.dataSource.data = data;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddCheckPoint() {
    firstValueFrom(this.page.getRaceFormat())
      .then(raceFormat =>
              this.dialog.open(AddRaceFormatCheckPointDialogComponent, {
                width: '600px',
                data: {
                  raceId: this.id,
                  raceFormatId: this.formatId,
                  startDateTime: raceFormat.startDateTime,
                },
              }))
      .then(value => value.afterClosed())
      .then(value => lastValueFrom(value))
      .then(value => this.refresh$.next());
  }
}
