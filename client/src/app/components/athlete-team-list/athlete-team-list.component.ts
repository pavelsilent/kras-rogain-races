import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell, MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { lastValueFrom, map, Subject } from 'rxjs';
import { AppService } from '../../app.service';
import { AddAthleteTeamDialogComponent } from '../../dialogs/add-athlete-team-dialog/add-athlete-team-dialog.component';
import { AthleteTeamModel } from '../../models/athlete-team.model';
import { EnumPipe } from '../../utils/enum.pipe';
import { hasLength } from '../../utils/utils';
import { AthleteTeamsService } from './athlete-teams.service';

@Component({
             selector: 'app-athlete-team-list',
             imports: [
               EnumPipe,
               MatButton,
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
               NgIf,
               NgClass,
               RouterLink,
               MatHeaderCellDef,

             ],
             templateUrl: './athlete-team-list.component.html',
             styleUrl: './athlete-team-list.component.css',
           })
export class AthleteTeamListComponent
  implements AfterViewInit {

  displayedColumns: string[] = ['name', 'sex'];
  dataSource = new MatTableDataSource<AthleteTeamModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  refresh$: Subject<void> = new Subject<void>();

  @Input()
  isSelectMode = false;

  @Input()
  selectedIds: number[] = [];
  selected: AthleteTeamModel;

  @Output()
  onSelectRow = new EventEmitter<AthleteTeamModel>();

  constructor(private service: AthleteTeamsService, private dialog: MatDialog, private appService: AppService) {
    this.refresh$.subscribe(
      value => this.service.getTeams()
                   .pipe(map(teams => teams.filter(team => !hasLength(this.selectedIds) ||
                     !this.selectedIds.includes(team.id!))))
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

  onAdd() {
    const dialogRef =
      this.dialog.open(AddAthleteTeamDialogComponent, {
        width: '500px',
        disableClose: true,
      });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => this.refresh$.next());

  }

  onSelectAthleteTeam(row: any) {
    this.selected = row;
    this.onSelectRow.next(row);
  }

}
