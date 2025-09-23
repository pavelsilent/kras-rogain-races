import { AsyncPipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { lastValueFrom, Observable, startWith, Subject, switchMap } from 'rxjs';
import { AddRaceFormatDialogComponent } from '../../dialogs/add-race-format-dialog/add-race-format-dialog.component';
import { RaceFormatModel } from '../../models/race-format.model';
import { RaceModel } from '../../models/race.model';
import { EnumPipe } from '../../utils/enum.pipe';
import { RussianDateTimePipe } from '../../utils/russian-date-time.pipe';
import { RussianDatePipe } from '../../utils/russian-date.pipe';
import { RaceService } from './race.service';

@Component({
             selector: 'app-race',
             imports: [
               RouterLink,
               AsyncPipe,
               NgIf,
               RussianDatePipe,
               MatButton,
               EnumPipe,
               MatCell,
               MatCellDef,
               MatColumnDef,
               MatHeaderCell,
               MatHeaderRow,
               MatHeaderRowDef,
               MatRow,
               MatRowDef,
               MatSort,
               MatSortHeader,
               MatTable,
               RussianDateTimePipe,
               MatHeaderCellDef,
             ],
             templateUrl: './race.component.html',
             standalone: true,
             styleUrl: './race.component.css',
           })
export class RaceComponent
  implements AfterViewInit {
  raceId: number;
  race$: Observable<RaceModel>;
  refresh$: Subject<void> = new Subject<void>();
  displayedColumns: string[] = ['name', 'type', 'startDateTime', 'finishDateTime', 'state'];
  raceFormatsDataSource = new MatTableDataSource<RaceFormatModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog) {
    this.raceId = Number(this.route.snapshot.paramMap.get('id'));
    this.race$ = this.service.getRaceById(this.raceId);
    this.refresh$.pipe(
      startWith(null),
      switchMap(value => this.service.getRaceFormats(this.raceId)),
    ).subscribe(data => this.raceFormatsDataSource.data = data);
  }

  ngAfterViewInit() {
    this.raceFormatsDataSource.paginator = this.paginator;
    this.raceFormatsDataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.raceFormatsDataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddRaceFormat() {
    const dialogRef =
      this.dialog.open(AddRaceFormatDialogComponent, {
        data: {
          raceId: this.raceId,
        },
        width: '500px',
      });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => this.refresh$.next());
  }
}
