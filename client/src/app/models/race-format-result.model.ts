import { Option } from 'funfix-core';
import { RaceFormatResultDTO } from '../api/index';
import { exists, resolveEnum } from '../utils/utils';
import { AthleteGroupModel } from './athlete-group.model';
import { RaceFormatType } from './enums/race-format-type.enum';
import { RaceAthleteModel } from './race-athlete.model';
import { RaceCheckPointModel } from './race-check-point.model';

export class RaceFormatResultModel {
  id: number;
  name: string;
  type?: RaceFormatType;
  checkPoints: RaceCheckPointModel[];
  athletesGroups: AthleteGroupModel[];
  athletes: RaceAthleteModel[];
  checkTime?: RaceAthleteModel;
  leader?: RaceAthleteModel;

  constructor(dto?: RaceFormatResultDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.type = resolveEnum(dto.type, RaceFormatType.store);
      this.checkPoints = Option.of(dto.checkPoints)
                               .map(points => points.map(value => RaceCheckPointModel.fromDTO(value)))
                               .getOrElse([]);
      this.athletesGroups = Option.of(dto.athleteGroups)
                                  .map(groups => groups.map(value => AthleteGroupModel.fromDTO(value)))
                                  .getOrElse([]);
      this.athletes = Option.of(dto.athletes)
                            .map(athletes => athletes.map(value => RaceAthleteModel.fromDTO(value)))
                            .getOrElse([]);
      this.checkTime = Option.of(dto.checkTime)
                             .map(data => RaceAthleteModel.fromDTO(data))
                             .getOrElse(undefined);
      this.leader = Option.of(dto.leaderTime)
                          .map(data => RaceAthleteModel.fromDTO(data))
                          .getOrElse(undefined);
    }
  }

  static fromDTO(dto?: RaceFormatResultDTO) {
    return new RaceFormatResultModel(dto);
  }
}
