import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { lastValueFrom, Subject } from 'rxjs';
import { AppService } from '../../app.service';
import { AddRaceDialogComponent } from '../../dialogs/add-race-dialog/add-race-dialog.component';
import { RaceModel } from '../../models/race.model';
import { RussianDatePipe } from '../../utils/russian-date.pipe';
import { RaceService } from '../race/race.service';

@Component({
             selector: 'app-race-list',
             templateUrl: './race-list.component.html',
             standalone: true,
             styleUrl: './race-list.component.css',
             imports: [
               MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule,
               RouterLink, MatButton, RussianDatePipe,
             ],
           })
export class RaceListComponent
  implements AfterViewInit {

  displayedColumns: string[] = ['name', 'type', 'date', 'city', 'state'];
  dataSource = new MatTableDataSource<RaceModel>();
  refresh$: Subject<void> = new Subject<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private raceService: RaceService, private dialog: MatDialog, private appService: AppService) {
    this.appService.setEditAvailable();
    this.refresh$.subscribe(
      data => this.raceService.getRaces()
                  .subscribe(data => this.dataSource.data = data));
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
      this.dialog.open(AddRaceDialogComponent, {
        width: '500px',
      });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => this.refresh$.next());

  }
}
