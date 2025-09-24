import { EnumValuesStorage } from '../../utils/enum-values-storage';
import { Enum } from '../../utils/enum';

export class AthleteGroupSex
  implements Enum {
  static store: EnumValuesStorage<AthleteGroupSex> = new EnumValuesStorage();

  static MALE = new AthleteGroupSex('MALE', 'Мужчины', '#0628e8');
  static FEMALE = new AthleteGroupSex('FEMALE', 'Женщины', '#8e06e8');
  static MIXED = new AthleteGroupSex('MIXED', 'Смешанная', '#ff0000');

  constructor(public code: string, public name: string, public color: string) {
    AthleteGroupSex.store.set(this.code, this);
  }
}
