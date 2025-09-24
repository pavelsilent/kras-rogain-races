import { CityDTO } from '../api/index';

import { exists, resolveEnum } from '../utils/utils';
import { CityType } from './enums/city-type.enum';

export class CityModel {
  id: number;
  name: string;
  type: CityType;

  constructor(dto?: CityDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.type = resolveEnum(dto.type, CityType.store);
    }
  }

  public getName() {
    if (!exists(this.type) || this.type === CityType.OTHER) {
      return this.name;
    }

    return this.type.shortName + ' ' + this.name;
  }

  static of(id: number) {
    let city = new CityModel();
    city.id = id;
    return city;
  }

  static fromDTO(dto?: CityDTO) {
    return new CityModel(dto);
  }

  toDTO(): CityDTO {
    return {
      id: this.id,
      name: this.name,
      type: this.type?.code,
    };
  }
}
