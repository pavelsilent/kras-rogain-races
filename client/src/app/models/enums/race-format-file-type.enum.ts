import { EnumValuesStorage } from '../../utils/enum-values-storage';

export class RaceFormatFileType {
  static store: EnumValuesStorage<RaceFormatFileType> = new EnumValuesStorage();

  static DISTANCE_SCHEMA = new RaceFormatFileType('DISTANCE_SCHEMA', 'Схема круга');
  static DISTANCE_ATTITUDE_PROFILE = new RaceFormatFileType('DISTANCE_ATTITUDE_PROFILE', 'Профиль высот');

  constructor(public code: string, public name: string) {
    RaceFormatFileType.store.set(this.code, this);
  }
}
