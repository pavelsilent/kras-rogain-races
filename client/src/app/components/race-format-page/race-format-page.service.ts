import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, ReplaySubject, shareReplay, Subject, switchMap } from 'rxjs';
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
  private canEditByToken$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  private needTokens$: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  private canEdit$: Observable<boolean>;
  refresh$: Subject<void> = new Subject<void>();

  constructor(private raceService: RaceService, private appService: AppService) {
    this.raceFormat$ = this.getData()
                           .pipe(switchMap(([raceId, raceFormatId, needTokens]) =>
                                             this.raceService.getRaceFormatById(
                                               raceId,
                                               raceFormatId,
                                               needTokens,
                                             )));
    this.canEdit$ = combineLatest([this.raceFormat$, this.appService.canEdit(), this.canEditByToken$.pipe()]).pipe(
      map(([raceFormat, canEditGlobal, canEditByToken]) => raceFormat.canEdit! && canEditGlobal && canEditByToken),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  setData(raceId: number, raceFormatId: number, needTokens: boolean) {
    this.raceId$.next(raceId);
    this.raceFormatId$.next(raceFormatId);
    this.needTokens$.next(needTokens);
  }

  getData() {
    return combineLatest([this.raceId$, this.raceFormatId$, this.needTokens$]);
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
    return this.canEdit$;
  }

  public setToken(mode: TokenType) {
    return this.setCanEditByToken(mode === TokenType.EDIT);
  }

  public setCanEditByToken(value: boolean) {
    this.canEditByToken$.next(value)
  }
}
