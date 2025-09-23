import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject, switchMap } from 'rxjs';
import { RaceFormatModel } from '../../models/race-format.model';
import { RaceService } from '../race/race.service';

@Injectable({
              providedIn: 'root',
            })
export class RaceFormatPageService {

  private raceId$: ReplaySubject<number> = new ReplaySubject<number>();
  private raceFormatId$: ReplaySubject<number> = new ReplaySubject<number>();
  private raceFormat$: Observable<RaceFormatModel>;

  constructor(private raceService: RaceService) {
    this.raceFormat$ = combineLatest([this.raceId$, this.raceFormatId$])
      .pipe(switchMap(([raceId, raceFormatId]) => this.raceService.getRaceFormatById(raceId, raceFormatId)));
  }

  setData(raceId: number, raceFormatId: number) {
    this.raceId$.next(raceId);
    this.raceFormatId$.next(raceFormatId);
  }

  getData() {
    return combineLatest([this.raceId$, this.raceFormatId$]);
  }

  public getRaceId() {
    return this.raceId$.pipe();
  }

  public getRaceFormatId() {
    return this.raceFormatId$.pipe();
  }

  public getRaceFormat() {
    return this.raceFormat$;
  }
}
