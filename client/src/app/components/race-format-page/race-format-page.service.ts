import { Injectable } from '@angular/core';
import { combineLatest, Observable, ReplaySubject, Subject, switchMap } from 'rxjs';
import { AppService } from '../../app.service';
import { TokenType } from '../../models/enums/token-type.enum';
import { RaceFormatModel } from '../../models/race-format.model';
import { RaceService } from '../race/race.service';

@Injectable({
              providedIn: 'root',
            })
export class RaceFormatPageService {

  private raceId$: ReplaySubject<number> = new ReplaySubject<number>();
  private raceFormatId$: ReplaySubject<number> = new ReplaySubject<number>();
  private raceFormat$: Observable<RaceFormatModel>;
  private canEdit$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  refresh$: Subject<void> = new Subject<void>();

  constructor(private raceService: RaceService, private appService: AppService) {
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

  getTokenData(token: string) {
    return this.raceService.getRaceFormatToken(token);
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

  public canEdit() {
    return this.canEdit$.pipe();
  }

  public setToken(mode: TokenType) {
    return this.setCanEdit(mode === TokenType.EDIT);
  }

  public setCanEdit(canEdit: boolean) {
    return this.canEdit$.next(canEdit);
  }
}
