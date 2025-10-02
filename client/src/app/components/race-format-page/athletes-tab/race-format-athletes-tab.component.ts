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
import { lastValueFrom, Subject } from 'rxjs';
import {
  AddRaceAthleteDialogComponent,
} from '../../../dialogs/add-race-athlete-dialog/add-race-athlete-dialog.component';
import { RaceAthleteModel } from '../../../models/race-athlete.model';
import { EnumPipe } from '../../../utils/enum.pipe';
import { RussianDatePipe } from '../../../utils/russian-date.pipe';
import { RussianTimePipe } from '../../../utils/russian-time.pipe';
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
               RussianTimePipe,
               RussianDatePipe,
               EnumPipe,
               MatButton,
               MatDivider,
             ],
             templateUrl: './race-format-athletes-tab.component.html',
             standalone: true,
             styleUrl: './race-format-athletes-tab.component.css',
           })
export class RaceFormatAthletesTabComponent
  implements AfterViewInit {
  id: number;
  formatId: number;
  displayedColumns: string[] = ['bib', 'fio', 'birthDate', 'sex', 'city', 'club', 'state'];
  dataSource = new MatTableDataSource<RaceAthleteModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  refresh$: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog) {
    this.id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    this.formatId = Number(this.route.parent?.snapshot.paramMap.get('formatId'));
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

  onAdd() {
    const dialogRef =
      this.dialog.open(AddRaceAthleteDialogComponent, {
        width: '500px',
        disableClose: true,
        data: {
          raceId: this.id,
          formatId: this.formatId,
        },
      });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => this.refresh$.next());

  }
}
