import { RaceAthleteGroupDTO } from '../api/index';
import { exists } from '../utils/utils';

export class RaceAthleteGroupModel {
  id: number;
  place: number;

  constructor(dto?: RaceAthleteGroupDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.place = dto.place;
    }
  }

  static fromDTO(dto?: RaceAthleteGroupDTO) {
    return new RaceAthleteGroupModel(dto);
  }
}
