import { Injectable } from '@angular/core';
import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { RaceControllerService } from '../../api/index';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { AthleteState } from '../../models/enums/athlete-state.enum';
import { RaceAthleteCheckPointSetupModel } from '../../models/race-athlete-check-point-setup.model';
import { RaceAthleteCheckPointModel } from '../../models/race-athlete-check-point.model';
import { RaceAthleteSetupModel } from '../../models/race-athlete-setup.model';
import { RaceAthleteModel } from '../../models/race-athlete.model';
import { RaceCheckPointSetupModel } from '../../models/race-check-point-setup.model';
import { RaceCheckPointModel } from '../../models/race-check-point.model';
import { RaceFormatResultLinkModel } from '../../models/race-format-result-link.model';
import { RaceFormatResultModel } from '../../models/race-format-result.model';
import { RaceFormatTokenModel } from '../../models/race-format-token.model';
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
      map(items => items.map(item => RaceModel.fromDTO(item))),
    );
  }

  getRaceById(id: number): Observable<RaceModel> {
    return this.backend.getRaceById(id).pipe(
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

  getRaceFormatToken(token: string): Observable<RaceFormatTokenModel> {
    return this.backend.getRaceFormatLink(token).pipe(
      map(item => RaceFormatTokenModel.fromDTO(item)),
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

  getRaceFormatResults(): Observable<RaceFormatResultLinkModel[]> {
    return this.backend.getActiveRaceFormatResults().pipe(
      map(items => items.map(item => RaceFormatResultLinkModel.fromDTO(item))),
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

  editRaceCheckPoint(id: number, formatId: number, checkPointId: number, data: RaceCheckPointSetupModel) {
    return lastValueFrom(this.backend.editRaceFormatCheckPoint(id, formatId, checkPointId, data.toDTO()));
  }

  addRaceAthleteCheckPoint(
    id: number,
    formatId: number,
    athleteBibNumber: number,
    data: RaceAthleteCheckPointModel,
  ): Promise<RaceFormatResultModel> {
    return lastValueFrom(this.backend.addRaceAthleteCheckPoint(
      id,
      formatId,
      athleteBibNumber,
      data.toDTO(),
    ))
      .then(value => RaceFormatResultModel.fromDTO(value));
  }

  getRaceAthleteCheckPoint(
    id: number,
    formatId: number,
    athleteBibNumber: number,
    checkPointId: number,
  ): Promise<RaceAthleteCheckPointSetupModel> {
    return lastValueFrom(this.backend.getRaceAthleteCheckPoint(id, formatId, athleteBibNumber, checkPointId))
      .then(value => RaceAthleteCheckPointSetupModel.fromDTO(value));
  }

  getRaceAthleteNextCheckPoint(
    id: number,
    formatId: number,
    athleteBibNumber: number,
  ): Promise<number> {
    return lastValueFrom(this.backend.getRaceAthleteNextCheckPoint(id, formatId, athleteBibNumber));
  }

  getRaceAthleteState(
    id: number,
    formatId: number,
    athleteBibNumber: number,
  ): Promise<AthleteState> {
    return lastValueFrom(this.backend.getRaceAthleteState(id, formatId, athleteBibNumber))
      .then(value => Option.of(value).map(value => value.value)
                           .map(code => AthleteState.store.get(code!))
                           .getOrElse(AthleteState.NOT_DATA));
  }

  setRaceAthleteState(
    id: number,
    formatId: number,
    athleteBibNumber: number,
    state: string,
  ): Promise<RaceFormatResultModel> {
    return lastValueFrom(this.backend.setRaceAthleteState(id, formatId, athleteBibNumber, { value: state }))
      .then(value => RaceFormatResultModel.fromDTO(value));
  }

  setRaceState(
    id: number,
    formatId: number,
    state: string,
    stateTime: LocalDateTime,
  ): Promise<RaceFormatResultModel> {
    const dto = { state: state, stateTime: stateTime };
    //@ts-ignore
    return lastValueFrom(this.backend.setRaceState(id, formatId, dto))
      //@ts-ignore
      .then(value => RaceFormatResultModel.fromDTO(value));
  }

}
