import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { combineLatest, firstValueFrom, lastValueFrom, Observable, startWith, switchMap, tap } from 'rxjs';
import { AppService } from '../../app.service';
import { SetRaceStateDialogComponent } from '../../dialogs/set-race-state/set-race-state-dialog.component';
import { RaceState } from '../../models/enums/race-state.enum';
import { RaceFormatModel } from '../../models/race-format.model';
import { RussianDateTimePipe } from '../../utils/russian-date-time.pipe';
import { RaceFormatPageService } from '../race-format-page/race-format-page.service';
import { RaceFormatResultComponent } from '../race-format-page/result-tab/race-format-result.component';
import { RaceService } from '../race/race.service';

@Component({
             selector: 'app-race-result-page',
             imports: [
               MatTab,
               MatTabGroup,
               NgForOf,
               RouterOutlet,
               MatButton,
               NgIf,
               AsyncPipe,
               RussianDateTimePipe,
               RaceFormatResultComponent,
             ],
             templateUrl: './race-result-page.component.html',
             standalone: true,
             styleUrl: './race-result-page.component.css',
             providers: [RaceFormatPageService],
           })
export class RaceResultPageComponent {

  raceFormat$: Observable<RaceFormatModel>;
  states = RaceState;
  protected readonly RaceState = RaceState;
  showAttitude: boolean;

  constructor(
    private route: ActivatedRoute,
    protected page: RaceFormatPageService,
    private appService: AppService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.appService.setEditUnavailable();

    let token = this.route.snapshot.paramMap.get('token')!;
    this.raceFormat$ = this.page.refresh$.pipe(
      startWith(null),
      switchMap(() => this.page.getTokenData(token)),
      tap(value => {
        this.page.setData(value.raceId, value.raceFormatId);
        this.page.setToken(value.tokenType);
      }),
      switchMap(value => this.page.getRaceFormat()),
    );
  }

  onSetRaceState(state: RaceState) {
    firstValueFrom(combineLatest([this.page.getRaceId(), this.page.getRaceFormatId(), this.page.getRaceFormat()]))
      .then(([raceId, raceFormatId, raceFormat]) =>
              this.dialog.open(SetRaceStateDialogComponent, {
                data: {
                  raceId: raceId,
                  raceFormatId: raceFormatId,
                  state: state,
                  stateDateTime: raceFormat.startDateTime,
                },
                width: '400px',
              }))
      .then(dialogRef => lastValueFrom(dialogRef.afterClosed()))
      .then(value => {
        const currentUrl = this.router.url;
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigateByUrl(currentUrl);
        });
      });
  }

  onToggleAttitudeProfileVisibility() {
    this.showAttitude = !this.showAttitude;
  }
}
