import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
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
import { RouterLink } from '@angular/router';
import { lastValueFrom, map, Subject } from 'rxjs';
import { AddAthleteDialogComponent } from '../../dialogs/add-athlete-dialog/add-athlete-dialog.component';
import { AthleteModel } from '../../models/athlete.model';
import { EnumPipe } from '../../utils/enum.pipe';
import { RussianDatePipe } from '../../utils/russian-date.pipe';
import { RussianTimePipe } from '../../utils/russian-time.pipe';
import { hasLength } from '../../utils/utils';
import { AthletesService } from './athletes.service';

@Component({
             standalone: true,
             selector: 'app-athlete-list',
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
               MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule,
               RouterLink, RussianTimePipe, RussianDatePipe, EnumPipe, MatButton, NgClass, NgIf,
             ],
             templateUrl: './athlete-list.component.html',
             styleUrl: './athlete-list.component.css',
           })
export class AthleteListComponent
  implements AfterViewInit {

  displayedColumns: string[] = ['fio', 'birthDate', 'sex', 'city', 'club'];
  dataSource = new MatTableDataSource<AthleteModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  refresh$: Subject<void> = new Subject<void>();

  @Input()
  isSelectMode = false;

  @Input()
  selectedIds: number[] = [];
  selected: AthleteModel;

  @Output()
  onSelectRow = new EventEmitter<AthleteModel>();

  constructor(private service: AthletesService, private dialog: MatDialog) {
    this.refresh$.subscribe(
      value => this.service.getAthletes()
                   .pipe(map(athletes => athletes.filter(athlete => !hasLength(this.selectedIds) ||
                     !this.selectedIds.includes(athlete.id!))))
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
      this.dialog.open(AddAthleteDialogComponent, {
        width: '500px',
      });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => this.refresh$.next());

  }

  protected readonly onselect = onselect;

  onSelectAthlete(row: any) {
    console.log(row);
    this.selected = row;
    this.onSelectRow.next(row);
  }
}
