import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom, Subject } from 'rxjs';
import { AppService } from '../../app.service';
import { AddRaceDialogComponent } from '../../dialogs/add-race-dialog/add-race-dialog.component';
import { RaceFormatResultLinkModel } from '../../models/race-format-result-link.model';
import { RaceModel } from '../../models/race.model';
import { RussianDatePipe } from '../../utils/russian-date.pipe';
import { RaceService } from '../race/race.service';

@Component({
             selector: 'app-start-page',
             imports: [
               MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule,
               RouterLink, MatButton, RussianDatePipe,
             ],
             templateUrl: './start-page.component.html',
             standalone: true,
             styleUrl: './start-page.component.css',
           })
export class StartPageComponent  implements AfterViewInit {

  displayedColumns: string[] = ['raceName', 'formatName', 'raceDate', 'state'];
  dataSource = new MatTableDataSource<RaceFormatResultLinkModel>();
  refresh$: Subject<void> = new Subject<void>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private raceService: RaceService, private dialog: MatDialog, private appService: AppService,
              private router: Router) {
    this.appService.setEditAvailable();
    this.refresh$.subscribe(
      data => this.raceService.getRaceFormatResults()
                  .subscribe(data => this.dataSource.data = data));
    this.refresh$.next();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navigate(token: string | undefined) {
    this.router.navigateByUrl(`/results/` + token);
  }
}
