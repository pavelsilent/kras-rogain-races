import { LocalDate } from '@js-joda/core';
import { Option } from 'funfix-core';
import { RaceDTO } from '../api/index';

import { exists, parseLocalDate, resolveEnum } from '../utils/utils';
import { CityModel } from './city.model';
import { RaceState } from './enums/race-state.enum';
import { RaceFormatModel } from './race-format.model';
import { RaceTypeModel } from './race-type.model';

export class RaceModel {
  id: number;
  name: string;
  description?: string;
  type: RaceTypeModel;
  date?: LocalDate;
  city?: CityModel;
  formats?: RaceFormatModel[];
  state?: RaceState;

  constructor(dto?: RaceDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.description = dto.description;
      this.date = parseLocalDate(dto.date);
      this.type = RaceTypeModel.fromDTO(dto.raceType);
      this.city = CityModel.fromDTO(dto.city);
      this.formats = Option.of(dto.formats)
                           .map(data => data.map(value => RaceFormatModel.fromDTO(value)))
                           .getOrElse([]);
      this.state = resolveEnum(dto.state!, RaceState.store);
    }
  }

  static fromDTO(dto?: RaceDTO) {
    return new RaceModel(dto);
  }
}
