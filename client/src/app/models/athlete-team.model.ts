import { Option } from 'funfix-core';
import { AthleteTeamDTO } from '../api/index';
import { exists } from '../utils/utils';
import { AthleteGroupSex } from './enums/athlete-group-sex.enum';
import { AthleteType } from './enums/athlete-type.enum';
import { MemberInfoModel } from './member-info.model';

export class AthleteTeamModel {
  id?: number;
  name: string;
  sex: AthleteGroupSex;
  members: MemberInfoModel[];

  constructor(dto?: AthleteTeamDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.name = dto.name;
      this.sex = AthleteGroupSex.store.get(dto.sex);
      this.members = Option.of(dto.members)
                           .map(data => data.map(member => MemberInfoModel.fromDTO(member)))
                           .getOrElse([]);
    }
  }

  public toMemberInfo(): MemberInfoModel {
    const member = new MemberInfoModel();
    member.id = this.id as any;
    member.name = this.name;
    member.type = AthleteType.ATHLETE_TEAM;
    return member;
  }

  static fromDTO(dto?: AthleteTeamDTO) {
    return new AthleteTeamModel(dto);
  }

  toDTO(): AthleteTeamDTO {
    return {
      id: this.id as any,
      name: this.name!,
      sex: this.sex?.code,
      members: Option.of(this.members)
                     .map(data => data.map(member => member.toDTO())).getOrElse([]),
    };
  }
}
