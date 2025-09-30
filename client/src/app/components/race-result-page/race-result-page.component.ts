import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { AppService } from '../../app.service';
import { RaceFormatModel } from '../../models/race-format.model';
import { RussianDateTimePipe } from '../../utils/russian-date-time.pipe';
import { RaceFormatPageService } from '../race-format-page/race-format-page.service';
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
             ],
             templateUrl: './race-result-page.component.html',
             standalone: true,
             styleUrl: './race-result-page.component.css',
             providers: [RaceFormatPageService],
           })
export class RaceResultPageComponent {
  raceFormat$: Observable<RaceFormatModel>;

  constructor(private route: ActivatedRoute, private page: RaceFormatPageService, private appService: AppService) {
    this.appService.setEditUnavailable();

    let token = this.route.snapshot.paramMap.get('token')!;
    this.raceFormat$ = this.page.getTokenData(token)
                           .pipe(
                             tap(value => {
                               this.page.setData(value.raceId, value.raceFormatId);
                               this.page.setToken(value.tokenType);
                             }),
                             switchMap(value => this.page.getRaceFormat()),
                           );

  }
}
