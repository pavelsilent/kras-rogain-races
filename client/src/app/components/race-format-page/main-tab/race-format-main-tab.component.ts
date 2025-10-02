import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Option } from 'funfix-core';
import { lastValueFrom, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AddFileDialogComponent } from '../../../dialogs/add-race-format-file-dialog/add-file-dialog.component';
import { RaceFormatFileType } from '../../../models/enums/race-format-file-type.enum';
import { RaceFormatModel } from '../../../models/race-format.model';
import { EnumPipe } from '../../../utils/enum.pipe';
import { BoolPipe } from '../../../utils/list.pipe';
import { RussianDateTimePipe } from '../../../utils/russian-date-time.pipe';
import { RussianDatePipe } from '../../../utils/russian-date.pipe';
import { RaceService } from '../../race/race.service';

@Component({
             selector: 'app-race-format-main-tab',
             imports: [
               AsyncPipe,
               MatButton,
               NgIf,
               RussianDatePipe,
               EnumPipe,
               RussianDateTimePipe,
               BoolPipe,
               RouterLink,
             ],
             templateUrl: './race-format-main-tab.component.html',
             standalone: true,
             styleUrl: './race-format-main-tab.component.css',
           })
export class RaceFormatMainTabComponent {
  id: number;
  formatId: number;
  raceFormat$: Observable<RaceFormatModel>;
  athleteGroups$: Observable<string[]>;
  refresh$: Subject<void> = new Subject<void>();
  basePath: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private service: RaceService,
    private dialog: MatDialog,
  ) {
    this.id = Number(this.route.parent?.snapshot.paramMap.get('id'));
    this.formatId = Number(this.route.parent?.snapshot.paramMap.get('formatId'));
    this.raceFormat$ = this.refresh$.pipe(
      startWith(null),
      switchMap(value => this.service.getRaceFormatById(this.id, this.formatId)),
    );
    this.athleteGroups$ = this.raceFormat$.pipe(
      map(data =>
            Option.of(data.athleteGroups)
                  .map(groups => groups.map(value => value.name))
                  .getOrElse([])));
    this.basePath = environment.apiBaseUrl;
  }

  navigate(token: string | undefined) {
    this.router.navigateByUrl(`/results/` + token);
  }

  onAddDistanceSchema() {
    const dialogRef = this.dialog.open(AddFileDialogComponent, {
      width: '600px',
      data: {
        entityId: this.formatId,
        entityType: 'RaceFormat',
        fileType: RaceFormatFileType.DISTANCE_SCHEMA.code,
      },
    });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => lastValueFrom(value))
      .then(value => this.refresh$.next());
  }

  onAddAttitudeProfile() {
    const dialogRef = this.dialog.open(AddFileDialogComponent, {
      width: '600px',
      data: {
        entityId: this.formatId,
        entityType: 'RaceFormat',
        fileType: RaceFormatFileType.DISTANCE_ATTITUDE_PROFILE.code,
      },
    });

    lastValueFrom(dialogRef.afterClosed())
      .then(value => lastValueFrom(value))
      .then(value => this.refresh$.next());
  }
}
