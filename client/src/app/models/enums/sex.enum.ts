import { EnumValuesStorage } from '../../utils/enum-values-storage';
import { Enum } from '../../utils/enum';

export class Sex
  implements Enum {
  static store: EnumValuesStorage<Sex> = new EnumValuesStorage();

  static MALE = new Sex('MALE', 'Мужчина', 'м');
  static FEMALE = new Sex('FEMALE', 'Женщина', 'ж');

  constructor(public code: string, public name: string, public short: string) {
    Sex.store.set(this.code, this);
  }
}
