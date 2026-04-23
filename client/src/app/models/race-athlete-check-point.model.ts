import { LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import { RaceAthleteCheckPointDTO } from '../api/index';
import { exists, parseLocalDateTime } from '../utils/utils';
import { MemberInfoModel } from './member-info.model';

export class RaceAthleteCheckPointModel {
  id: number;
  time?: LocalDateTime;
  raceTime?: LocalDateTime;
  raceDuration?: string;
  diffSpeed?: number;
  prevCheckPointDiffDuration?: string;
  passed?: boolean;
  checkTimeExpired: boolean = false;
  checkPointMembers: MemberInfoModel[];

  constructor(dto?: RaceAthleteCheckPointDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.time = parseLocalDateTime(dto.time);
      this.raceTime = parseLocalDateTime(dto.raceTime);
      this.raceDuration = dto.raceDuration;
      this.diffSpeed = dto.diffSpeed;
      this.prevCheckPointDiffDuration = dto.prevCheckPointDiffDuration;
      this.passed = dto.passed;
      this.checkTimeExpired = dto.checkTimeExpired ?? false;
      this.checkPointMembers = Option.of(dto.members)
                                     .map(data => data.map(value => MemberInfoModel.fromDTO(value)))
                                     .getOrElse([]);
    }
  }

  static fromDTO(dto?: RaceAthleteCheckPointDTO) {
    return new RaceAthleteCheckPointModel(dto);
  }

  toDTO(): RaceAthleteCheckPointDTO {
    return {
      id: this.id,
      // @ts-ignore
      time: this.time,
      // @ts-ignore
      raceTime: this.raceTime,
      raceDuration: this.raceDuration,
      diffSpeed: this.diffSpeed,
      previousCheckPointDiffTime: this.prevCheckPointDiffDuration,
      // @ts-ignore
      passed: this.passed,
      members: Option.of(this.checkPointMembers).map(data => data.map(item => item.toDTO())).getOrElse([]),
    };
  }

}
