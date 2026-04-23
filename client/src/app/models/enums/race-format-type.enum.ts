import { EnumValuesStorage } from '../../utils/enum-values-storage';
import { AthleteType } from './athlete-type.enum';

export class RaceFormatType {
  static store: EnumValuesStorage<RaceFormatType> = new EnumValuesStorage();

  static PERSONAL = new RaceFormatType('PERSONAL', 'Лично', AthleteType.ATHLETE);
  static TEAM = new RaceFormatType('TEAM', 'Команда', AthleteType.ATHLETE_TEAM);

  constructor(public code: string, public name: string, public athleteType: AthleteType) {
    RaceFormatType.store.set(this.code, this);
  }
}
