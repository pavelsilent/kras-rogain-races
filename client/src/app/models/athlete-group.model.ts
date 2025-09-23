import { AthleteGroupDTO } from '../api/index';
import { exists } from '../utils/utils';

export class AthleteGroupModel {
  id: number;
  name: string;

  constructor(dto?: AthleteGroupDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
    }
  }

  static fromDTO(dto?: AthleteGroupDTO) {
    return new AthleteGroupModel(dto);
  }

  toDTO(): AthleteGroupDTO {
    return {
      id: this.id,
      name: this.name,
    };
  }
}
