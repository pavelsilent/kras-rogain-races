import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import { RaceAthleteCheckPointDTO, RaceFormatDTO } from '../api/index';
import { exists, parseLocalDateTime, resolveEnum, resolveEnumOrDefault } from '../utils/utils';
import { AthleteGroupModel } from './athlete-group.model';
import { RaceFormatType } from './enums/race-format-type.enum';
import { RaceState } from './enums/race-state.enum';

export class RaceFormatModel {
  id: number;
  name: string;
  description?: string;
  type: RaceFormatType;
  state: RaceState;
  startDateTime?: LocalDateTime;
  finishDateTime?: LocalDateTime;
  athleteGroups?: AthleteGroupModel[];

  constructor(dto?: RaceFormatDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.description = dto.description;
      this.type = resolveEnumOrDefault(dto.type, RaceFormatType.store, RaceFormatType.PERSONAL);
      this.state = resolveEnum(dto.state, RaceState.store);
      this.startDateTime = parseLocalDateTime(dto.startTime);
      this.finishDateTime = parseLocalDateTime(dto.finishTime);
      this.athleteGroups = Option.of(dto.athleteGroups)
                                 .map(groups => groups.map(value => AthleteGroupModel.fromDTO(value)))
                                 .getOrElse([]);
    }
  }

  static fromDTO(dto?: RaceFormatDTO) {
    return new RaceFormatModel(dto);
  }

  toDTO(): RaceFormatDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      type: this.type.code,
      state: this.state?.code,
      // @ts-ignore
      startTime: this.startDateTime,
      // @ts-ignore
      finishTime: this.finishDateTime,
      athleteGroups: this.athleteGroups?.map(value => value.toDTO())
    };
  }
}
