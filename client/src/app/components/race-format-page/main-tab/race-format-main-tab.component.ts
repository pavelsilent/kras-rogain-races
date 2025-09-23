import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Option } from 'funfix-core';
import { map, Observable, startWith, Subject, switchMap } from 'rxjs';
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

  constructor(private route: ActivatedRoute, private service: RaceService) {
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
  }
}
