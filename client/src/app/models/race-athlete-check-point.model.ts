import { LocalDateTime } from '@js-joda/core';
import { RaceAthleteCheckPointDTO } from '../api/index';
import { exists, parseLocalDateTime } from '../utils/utils';

export class RaceAthleteCheckPointModel {
  id: number;
  time?: LocalDateTime;
  raceTime?: LocalDateTime;
  raceDuration?: string;
  prevCheckPointDiffDuration?: string;
  passed?: boolean;
  checkTimeExpired: boolean = false;

  constructor(dto?: RaceAthleteCheckPointDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.time = parseLocalDateTime(dto.time);
      this.raceTime = parseLocalDateTime(dto.raceTime);
      this.raceDuration = dto.raceDuration;
      this.prevCheckPointDiffDuration = dto.prevCheckPointDiffDuration;
      this.passed = dto.passed;
      this.checkTimeExpired = dto.checkTimeExpired ?? false;
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
      previousCheckPointDiffTime: this.prevCheckPointDiffDuration,
      // @ts-ignore
      passed: this.passed,
    };
  }

}
