import { LocalDateTime } from '@js-joda/core';
import { RaceAthleteCheckPointSetupDTO } from '../api/index';
import { exists, parseLocalDateTime } from '../utils/utils';
import { RaceAthleteCheckPointModel } from './race-athlete-check-point.model';

export class RaceAthleteCheckPointSetupModel {
  data: RaceAthleteCheckPointModel;
  prevPointTime: LocalDateTime;
  nextPointTime: LocalDateTime;

  constructor(dto?: RaceAthleteCheckPointSetupDTO) {
    if (exists(dto)) {
      this.data = RaceAthleteCheckPointModel.fromDTO(dto.data);
      this.prevPointTime = parseLocalDateTime(dto.prevPointTime)!;
      this.nextPointTime = parseLocalDateTime(dto.nextPointTime)!;
    }
  }

  static fromDTO(dto?: RaceAthleteCheckPointSetupDTO) {
    return new RaceAthleteCheckPointSetupModel(dto);
  }
}
