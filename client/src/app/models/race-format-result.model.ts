import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import { RaceFormatResultDTO } from '../api/index';
import { exists, parseLocalDateTime, resolveEnum } from '../utils/utils';
import { AthleteGroupModel } from './athlete-group.model';
import { RaceFormatType } from './enums/race-format-type.enum';
import { RaceState } from './enums/race-state.enum';
import { RaceCheckPointModel } from './race-check-point.model';
import { RaceMemberModel } from './race-member.model';

export class RaceFormatResultModel {
  id: number;
  name: string;
  type?: RaceFormatType;
  checkPoints: RaceCheckPointModel[];
  athletesGroups: AthleteGroupModel[];
  athletes: RaceMemberModel[];
  startDateTime?: LocalDateTime;
  finishDateTime?: LocalDateTime;
  state: RaceState;
  attitudeProfileFileId: number;
  distanceSchemaFileId: number;

  constructor(dto?: RaceFormatResultDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.type = resolveEnum(dto.type, RaceFormatType.store);
      this.startDateTime = parseLocalDateTime(dto.startTime);
      this.finishDateTime = parseLocalDateTime(dto.finishTime);
      this.checkPoints = Option.of(dto.checkPoints)
                               .map(points => points.map(value => RaceCheckPointModel.fromDTO(value)))
                               .getOrElse([]);
      this.athletesGroups = Option.of(dto.athleteGroups)
                                  .map(groups => groups.map(value => AthleteGroupModel.fromDTO(value)))
                                  .getOrElse([]);
      this.athletes = Option.of(dto.athletes)
                            .map(athletes => athletes.map(value => RaceMemberModel.fromDTO(value)))
                            .getOrElse([]);
      this.state = resolveEnum(dto.state!, RaceState.store);
      this.attitudeProfileFileId = dto.attitudeProfileFileId!;
      this.distanceSchemaFileId = dto.distanceSchemaFileId!;
    }
  }

  static fromDTO(dto?: RaceFormatResultDTO) {
    return new RaceFormatResultModel(dto);
  }
}
