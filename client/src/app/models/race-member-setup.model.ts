import { RaceMemberSetupDTO } from '../api/index';
import { AthleteType } from './enums/athlete-type.enum';

export class RaceMemberSetupModel {
  id: number;
  bibNumber: number;
  memberType: AthleteType;
  memberId: number;
  athleteGroupId: number;

  toDTO(): RaceMemberSetupDTO {
    return {
      id: this.id,
      bibNumber: this.bibNumber,
      memberType: this.memberType.code,
      memberId: this.memberId!,
      athleteGroupId: this.athleteGroupId,
    };
  }
}
