import { RaceAthleteSetupDTO } from '../api/index';
import { AthleteModel } from './athlete.model';

export class RaceAthleteSetupModel {
  bibNumber: number;
  athlete: AthleteModel;
  athleteGroupId: number;

  toDTO(): RaceAthleteSetupDTO {
    return {
      bibNumber: this.bibNumber,
      athleteId: this.athlete.id!,
      athleteGroupId: this.athleteGroupId,
    };
  }
}
