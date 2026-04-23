import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
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
import { ActivatedRoute } from '@angular/router';
import { first, firstValueFrom, lastValueFrom, Observable, ReplaySubject, startWith, switchMap } from 'rxjs';
import { AddAthleteTeamDialogComponent } from '../../dialogs/add-athlete-team-dialog/add-athlete-team-dialog.component';
import { SelectAthleteDialog } from '../../dialogs/select-athlete-dialog/select-athlete-dialog';
import { AthleteTeamModel } from '../../models/athlete-team.model';
import { MemberInfoModel } from '../../models/member-info.model';
import { EnumPipe } from '../../utils/enum.pipe';
import { AthleteTeamsService } from '../athlete-team-list/athlete-teams.service';

@Component({
             selector: 'app-athlete-team',
             imports: [
               AsyncPipe,
               EnumPipe,
               MatButton,
               NgIf,
               MatCell,
               MatCellDef,
               MatColumnDef,
               MatHeaderCell,
               MatHeaderRow,
               MatHeaderRowDef,
               MatIcon,
               MatPaginator,
               MatRow,
               MatRowDef,
               MatSort,
               MatSortHeader,
               MatTable,
               MatHeaderCellDef,
             ],
             templateUrl: './athlete-team.component.html',
             styleUrl: './athlete-team.component.css',
           })
export class AthleteTeamComponent {
  athleteTeamId!: number;
  athleteTeam$: Observable<AthleteTeamModel>;
  refresh$: ReplaySubject<void> = new ReplaySubject<void>();
  displayedColumns: string[] = ['member', 'actions'];
  dataSource = new MatTableDataSource<MemberInfoModel>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute, private service: AthleteTeamsService, private dialog: MatDialog) {
    this.athleteTeamId = Number(this.route.snapshot.paramMap.get('id'));
    this.athleteTeam$ =
      this.refresh$.pipe(
        startWith(null),
        switchMap(value => this.service.getTeamById(this.athleteTeamId)),
      );

    this.athleteTeam$.subscribe(data => this.dataSource.data = data.members);

  }

  onEdit() {
    this.athleteTeam$.pipe(first()).subscribe(team => {
      const dialogRef = this.dialog.open(AddAthleteTeamDialogComponent, {
        data: { team },
        width: '500px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) { // если данные были изменены
          this.refresh$.next();
        }
      });
    });
  }

  // constructor(private route: ActivatedRoute, private service: RaceService, private dialog: MatDialog) {
  //   this.id = Number(this.route.parent?.snapshot.paramMap.get('id'));
  //   this.formatId = Number(this.route.parent?.snapshot.paramMap.get('formatId'));
  //   this.refresh$.subscribe(
  //     value => this.service.getRaceFormatsAthletes(this.id, this.formatId)
  //                  .subscribe(data => this.dataSource.data = data),
  //   );
  //   this.refresh$.next();
  // }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onAddAthlete() {

    this.athleteTeam$.pipe(first()).subscribe(team => {
      const dialogRef = this.dialog.open(SelectAthleteDialog, {
        width: '900px',
        height: '850px',
        maxWidth: '90vw',
        disableClose: true,
        data: { selectedAthleteIds: team.members.map(item => item.id) },
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.service.addTeamMember(team, result?.toMemberInfo())
              .then(r => this.refresh$.next());
        }
      });
    });
  }

  onDeleteAthlete(row: MemberInfoModel) {
    firstValueFrom(this.athleteTeam$)
      .then(data => this.service.deleteTeamMember(data, row))
      .then(value => this.refresh$.next());
  }
}
