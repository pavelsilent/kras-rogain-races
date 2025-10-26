import { RaceAthleteSetupDTO } from '../api/index';
import { AthleteModel } from './athlete.model';

export class RaceAthleteSetupModel {
  id: number;
  bibNumber: number;
  athlete: AthleteModel;
  athleteGroupId: number;

  toDTO(): RaceAthleteSetupDTO {
    return {
      id: this.id,
      bibNumber: this.bibNumber,
      athleteId: this.athlete.id!,
      athleteGroupId: this.athleteGroupId,
    };
  }
}
