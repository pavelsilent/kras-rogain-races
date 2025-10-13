import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Observable, startWith, switchMap, tap } from 'rxjs';
import { AppService } from '../../app.service';
import { RaceFormatModel } from '../../models/race-format.model';
import { RussianDateTimePipe } from '../../utils/russian-date-time.pipe';
import { RaceFormatPageService } from '../race-format-page/race-format-page.service';
import {
  RaceFormatResultCompactComponent,
} from '../race-format-page/result-tab-compact/race-format-result-compact.component';
import { RaceFormatResultComponent } from '../race-format-page/result-tab/race-format-result.component';

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
               RaceFormatResultCompactComponent,
               MatSlideToggle,
               FormsModule,
               MatIcon,
             ],
             templateUrl: './race-result-page.component.html',
             standalone: true,
             styleUrl: './race-result-page.component.css',
             providers: [RaceFormatPageService],
           })
export class RaceResultPageComponent {

  raceFormat$: Observable<RaceFormatModel>;
  showAttitude: boolean;
  showDistanceSchema: boolean;
  isMobile = false;

  constructor(
    private route: ActivatedRoute,
    protected page: RaceFormatPageService,
    protected appService: AppService,
    private dialog: MatDialog,
  ) {
    let token = this.route.snapshot.paramMap.get('token')!;
    this.raceFormat$ = this.page.refresh$.pipe(
      startWith(null),
      switchMap(() => this.page.getTokenData(token)),
      tap(value => {
        this.page.setData(value.raceId, value.raceFormatId, false);
        this.page.setToken(value.tokenType);
      }),
      switchMap(value => this.page.getRaceFormat()),
    );
  }

}
