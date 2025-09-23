import { EnumValuesStorage } from '../../utils/enum-values-storage';
import { Enum } from '../../utils/enum';

export class Sex
  implements Enum {
  static store: EnumValuesStorage<Sex> = new EnumValuesStorage();

  static MALE = new Sex('MALE', 'Мужчина');
  static FEMALE = new Sex('FEMALE', 'Женщина');

  constructor(public code: string, public name: string) {
    Sex.store.set(this.code, this);
  }
}
