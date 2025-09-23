import { RaceTypeDTO } from '../api/index';

import { exists } from '../utils/utils';

export class RaceTypeModel {
  id: number;
  name: string;
  description?: string;

  constructor(dto?: RaceTypeDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.description = dto.description;
    }
  }

  static fromDTO(dto?: RaceTypeDTO) {
    return new RaceTypeModel(dto);
  }

  toDTO(): RaceTypeDTO {
    return {
      id: this.id,
      name: this.name,
      // @ts-ignore
      description: this.description,
    };
  }
}
