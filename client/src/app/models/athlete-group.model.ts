import { AthleteGroupDTO } from '../api/index';
import { exists, resolveEnumOrDefault } from '../utils/utils';
import { AthleteGroupSex } from './enums/athlete-group-sex.enum';

export class AthleteGroupModel {
  id: number;
  name: string;
  description?: string;
  sex: AthleteGroupSex;

  constructor(dto?: AthleteGroupDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.description = dto.description;
      this.sex = resolveEnumOrDefault(dto.sex, AthleteGroupSex.store, undefined);
    }
  }

  static fromDTO(dto?: AthleteGroupDTO) {
    return new AthleteGroupModel(dto);
  }

  toDTO(): AthleteGroupDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      sex: this.sex.code,
    };
  }
}
