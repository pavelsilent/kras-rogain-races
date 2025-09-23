import { EnumValuesStorage } from '../../utils/enum-values-storage';

export class RaceFormatType {
  static store: EnumValuesStorage<RaceFormatType> = new EnumValuesStorage();

  static PERSONAL = new RaceFormatType('PERSONAL', 'Лично');
  static TEAM = new RaceFormatType('TEAM', 'Команда');

  constructor(public code: string, public name: string) {
    RaceFormatType.store.set(this.code, this);
  }
}
