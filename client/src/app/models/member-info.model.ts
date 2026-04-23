import { MemberInfoDTO } from '../api/index';
import { exists, resolveEnumOrDefault } from '../utils/utils';
import { AthleteType } from './enums/athlete-type.enum';

export class MemberInfoModel {
  id: number;
  type: AthleteType;
  name: string;

  constructor(dto?: MemberInfoDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.type = resolveEnumOrDefault(dto.type, AthleteType.store, AthleteType.ATHLETE);
      this.name = dto.name;
    }
  }

  static fromDTO(dto?: MemberInfoDTO) {
    return new MemberInfoModel(dto);
  }

  toDTO(): MemberInfoDTO {
    return {
      id: this.id as any,
      type: this.type.code!,
      name: this.name,
    };
  }
}
