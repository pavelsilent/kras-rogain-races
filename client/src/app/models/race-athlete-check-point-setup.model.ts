import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import { RaceAthleteCheckPointSetupDTO } from '../api/index';
import { exists, parseLocalDateTime } from '../utils/utils';
import { MemberInfoModel } from './member-info.model';
import { RaceAthleteCheckPointModel } from './race-athlete-check-point.model';

export class RaceAthleteCheckPointSetupModel {
  data: RaceAthleteCheckPointModel;
  prevPointTime: LocalDateTime;
  nextPointTime: LocalDateTime;
  availableMembers: MemberInfoModel[];

  constructor(dto?: RaceAthleteCheckPointSetupDTO) {
    if (exists(dto)) {
      this.data = RaceAthleteCheckPointModel.fromDTO(dto.data);
      this.prevPointTime = parseLocalDateTime(dto.prevPointTime)!;
      this.nextPointTime = parseLocalDateTime(dto.nextPointTime)!;
      this.availableMembers = Option.of(dto.members)
                                    .map(data => data.map(value => MemberInfoModel.fromDTO(value)))
                                    .getOrElse([]);
    }
  }

  static fromDTO(dto?: RaceAthleteCheckPointSetupDTO) {
    return new RaceAthleteCheckPointSetupModel(dto);
  }
}
