import { LocalDateTime } from '@js-joda/core';
import { RaceAthleteCheckPointDTO } from '../api/index';
import { exists, parseLocalDateTime } from '../utils/utils';

export class RaceAthleteCheckPointModel {
  id: number;
  athleteBibNumber: number;
  time?: LocalDateTime;
  raceTime?: LocalDateTime;
  diffTime?: LocalDateTime;
  passed?: boolean;

  constructor(dto?: RaceAthleteCheckPointDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.time = parseLocalDateTime(dto.time);
      this.raceTime = parseLocalDateTime(dto.raceTime);
      this.diffTime = parseLocalDateTime(dto.previousCheckPointDiffTime);
      this.passed = dto.passed;
    }
  }

  static fromDTO(dto?: RaceAthleteCheckPointDTO) {
    return new RaceAthleteCheckPointModel(dto);
  }

  toDTO(): RaceAthleteCheckPointDTO {

    // @ts-ignore
    return {
      id: this.id,
      athleteBibNumber: this.athleteBibNumber,

      // @ts-ignore
      time: this.time,

      // @ts-ignore
      raceTime: this.raceTime,
      // @ts-ignore
      previousCheckPointDiffTime: this.diffTime,
      // @ts-ignore
      passed: this.passed,
    };
  }

}
