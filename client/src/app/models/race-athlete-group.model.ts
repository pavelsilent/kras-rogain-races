import { RaceAthleteGroupDTO } from '../api/index';
import { exists } from '../utils/utils';
import { AthleteGroupModel } from './athlete-group.model';

export class RaceAthleteGroupModel {
  group: AthleteGroupModel;
  place: number;

  constructor(dto?: RaceAthleteGroupDTO) {
    if (exists(dto)) {
      this.group = AthleteGroupModel.fromDTO(dto.group);
      this.place = dto.place;
    }
  }

  static fromDTO(dto?: RaceAthleteGroupDTO) {
    return new RaceAthleteGroupModel(dto);
  }
}
