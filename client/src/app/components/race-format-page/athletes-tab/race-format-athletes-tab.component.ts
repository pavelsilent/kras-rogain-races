import { AsyncPipe } from '@angular/common';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
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
import { firstValueFrom, lastValueFrom, map, Observable, Subject } from 'rxjs';
import {
  AddRaceAthleteDialogComponent,
} from '../../../dialogs/add-race-athlete-dialog/add-race-athlete-dialog.component';
import { AthleteType } from '../../../models/enums/athlete-type.enum';
import { RaceFormatModel } from '../../../models/race-format.model';
import { RaceMemberModel } from '../../../models/race-member.model';
import { EnumPipe } from '../../../utils/enum.pipe';
import { RaceService } from '../../race/race.service';

@Component({
             selector: 'app-race-format-athletes-tab.component',
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
               EnumPipe,
               MatButton,
               MatIcon,
               AsyncPipe,
             ],
             templateUrl: './race-format-athletes-tab.component.html',
             standalone: true,
             styleUrl: './race-format-athletes-tab.component.css',
           })
export class RaceFormatAthletesTabComponent
  implements AfterViewInit {
  id: number;
  formatId: number;
  displayedColumns: string[] = ['bib', 'fio', 'groups', 'state', 'delete'];
  dataSource = new MatTableDataSource<RaceMemberModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  refresh$: Subject<void> = new Subject<void>();
  raceFormat$: Observable<RaceFormatModel>;
  memberLabel$: Observable<string>;

  constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog) {
    this.id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    this.formatId = Number(this.route.parent?.snapshot.paramMap.get('formatId'));
    this.raceFormat$ = this.service.getRaceFormatById(this.id, this.formatId, true);
    this.memberLabel$ = this.raceFormat$.pipe(map(x => x.type.athleteType === AthleteType.ATHLETE
                                                       ? 'Добавить атлета'
                                                       : 'Добавить команду'));
    this.refresh$.subscribe(
      value => this.service.getRaceFormatsAthletes(this.id, this.formatId)
                   .subscribe(data => this.dataSource.data = data),
    );
    this.refresh$.next();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddMember() {
    firstValueFrom(this.raceFormat$)
      .then(raceFormat => {
        const dialogRef =
          this.dialog.open(AddRaceAthleteDialogComponent, {
            width: '500px',
            disableClose: true,
            data: {
              raceId: this.id,
              formatId: this.formatId,
              athleteType: raceFormat.type.athleteType,
            },
          });
        lastValueFrom(dialogRef.afterClosed())
          .then(value => this.refresh$.next());
      });
  }

  onEditMember(row: RaceMemberModel) {
    const dialogRef =
      this.dialog.open(AddRaceAthleteDialogComponent, {
        width: '500px',
        disableClose: true,
        data: {
          raceId: this.id,
          formatId: this.formatId,
          athleteType: row.type,
          raceMember: row,
        },
      });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => this.refresh$.next());
  }

  onDelete(row: RaceMemberModel) {
    this.service.deleteRaceAthlete(this.id, this.formatId, row)
        .then(value => this.refresh$.next());
  }
}
