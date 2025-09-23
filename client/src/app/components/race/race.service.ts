import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable, tap } from 'rxjs';
import { RaceControllerService } from '../../api/index';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { RaceAthleteCheckPointModel } from '../../models/race-athlete-check-point.model';
import { RaceAthleteSetupModel } from '../../models/race-athlete-setup.model';
import { RaceAthleteModel } from '../../models/race-athlete.model';
import { RaceCheckPointSetupModel } from '../../models/race-check-point-setup.model';
import { RaceCheckPointModel } from '../../models/race-check-point.model';
import { RaceFormatResultModel } from '../../models/race-format-result.model';
import { RaceFormatModel } from '../../models/race-format.model';
import { RaceSetupModel } from '../../models/race-setup.model';
import { RaceModel } from '../../models/race.model';

@Injectable({
              providedIn: 'root',
            })
export class RaceService {

  constructor(public backend: RaceControllerService) {
  }

  getRaces(): Observable<RaceModel[]> {
    return this.backend.getAllRaces().pipe(
      tap(value => console.log(value)),
      map(items => items.map(item => RaceModel.fromDTO(item))),
    );
  }

  getRaceById(id: number): Observable<RaceModel> {
    return this.backend.getRaceById(id).pipe(
      tap(value => console.log(value)),
      map(item => RaceModel.fromDTO(item)),
    );
  }

  getRaceFormats(id: number): Observable<RaceFormatModel[]> {
    return this.backend.getRaceFormats(id).pipe(
      map(items => items.map(item => RaceFormatModel.fromDTO(item))),
    );
  }

  getRaceFormatById(id: number, formatId: number): Observable<RaceFormatModel> {
    return this.backend.getRaceFormat(id, formatId).pipe(
      map(item => RaceFormatModel.fromDTO(item)),
    );
  }

  getRaceFormatsAthletes(id: number, formatId: number): Observable<RaceAthleteModel[]> {
    return this.backend.getRaceFormatAthletes(id, formatId).pipe(
      map(items => items.map(item => RaceAthleteModel.fromDTO(item))),
    );
  }

  getRaceFormatsCheckPoints(id: number, formatId: number): Observable<RaceCheckPointModel[]> {
    return this.backend.getRaceFormatCheckPoints(id, formatId).pipe(
      map(items => items.map(item => RaceCheckPointModel.fromDTO(item))),
    );
  }

  getRaceFormatResult(id: number, formatId: number): Observable<RaceFormatResultModel> {
    return this.backend.getRaceFormatResultTable(id, formatId).pipe(
      map(item => RaceFormatResultModel.fromDTO(item)));
  }

  createRace(data: RaceSetupModel): Promise<number> {
    return lastValueFrom(this.backend.createRace(data.toDTO()));
  }

  createRaceFormat(id: number, data: RaceFormatModel): Promise<number> {
    return lastValueFrom(this.backend.addRaceFormat(id, data.toDTO()));
  }

  addRaceAthleteGroups(id: number, formatId: number, data: AthleteGroupModel[]) {
    return lastValueFrom(this.backend.addRaceFormatAthleteGroups(id, formatId, data.map(value => value.toDTO())));
  }

  addRaceAthlete(id: number, formatId: number, data: RaceAthleteSetupModel) {
    return lastValueFrom(this.backend.addRaceFormatAthlete(id, formatId, data.toDTO()));
  }

  addRaceCheckPoint(id: number, formatId: number, data: RaceCheckPointSetupModel) {
    return lastValueFrom(this.backend.addRaceFormatCheckPoint(id, formatId, data.toDTO()));
  }

  addRaceAthleteCheckPoint(
    id: number,
    formatId: number,
    data: RaceAthleteCheckPointModel,
  ): Promise<RaceFormatResultModel> {
    return lastValueFrom(this.backend.addRaceAthleteCheckPoint(id, formatId, data.toDTO()))
      .then(value => RaceFormatResultModel.fromDTO(value));
  }

}
