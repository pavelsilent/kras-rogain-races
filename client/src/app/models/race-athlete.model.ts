import { Option } from 'funfix-core';
import { RaceAthleteDTO } from '../api/index';
import { exists, resolveEnumOrDefault } from '../utils/utils';
import { AthleteModel } from './athlete.model';
import { AthleteState } from './enums/athlete-state.enum';
import { AthleteType } from './enums/athlete-type.enum';
import { RaceAthleteCheckPointModel } from './race-athlete-check-point.model';
import { RaceAthleteGroupModel } from './race-athlete-group.model';
import { RaceCheckPointModel } from './race-check-point.model';

export class RaceAthleteModel {
  bibNumber: number;
  athlete: AthleteModel;
  state: AthleteState;
  type: AthleteType;
  checkPoints: RaceAthleteCheckPointModel[];
  lastCheckPoint: RaceCheckPointModel;
  lastRaceAthleteCheckPoint: RaceAthleteCheckPointModel;
  groupPlaces: RaceAthleteGroupModel[];
  absolutePlace: number;

  isFinished() : boolean {
    return this.state === AthleteState.FINISHED;
  }

  isDisqualified() : boolean {
    return this.state === AthleteState.DISQUALIFIED;
  }

  constructor(dto?: RaceAthleteDTO) {
    if (exists(dto)) {
      this.bibNumber = dto.bibNumber;
      this.athlete = AthleteModel.fromDTO(dto.athlete);
      this.state = resolveEnumOrDefault(dto.state, AthleteState.store, AthleteState.NOT_DATA);
      this.type = resolveEnumOrDefault(dto.type, AthleteType.store, AthleteType.ATHLETE);
      this.checkPoints = Option.of(dto.checkPoints)
                               .map(data => data.map(dto => RaceAthleteCheckPointModel.fromDTO(dto)))
                               .getOrElse([]);
      this.lastCheckPoint = Option.of(dto.lastCheckPoint)
                                  .map(dto => RaceCheckPointModel.fromDTO(dto))
                                  .getOrElse(undefined)!;
      this.lastRaceAthleteCheckPoint = Option.of(dto.lastCheckPoint)
                                             .map(dto => dto.id)
                                             .map(id => this.checkPoints.find(checkPoint => checkPoint.id === id))
                                             .getOrElse(undefined)!;
      this.absolutePlace = dto.absPlace!;
      this.groupPlaces = Option.of(dto.places)
                               .map(data => data.map(dto => RaceAthleteGroupModel.fromDTO(dto)))
                               .getOrElse([]);
    }
  }

  static fromDTO(dto?: RaceAthleteDTO) {
    return new RaceAthleteModel(dto);
  }
}
