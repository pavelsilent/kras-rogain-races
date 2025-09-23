import { EnumValuesStorage } from '../../utils/enum-values-storage';
import { Enum } from '../../utils/enum';

export class AthleteType
  implements Enum {
  static store: EnumValuesStorage<AthleteType> = new EnumValuesStorage();

  static ATHLETE = new AthleteType('ATHLETE', 'Атлет');
  static LEADER = new AthleteType('LEADER', 'Прогнозируемый лидер');
  static CONTROL = new AthleteType('CONTROL', 'Контрольное время');

  constructor(public code: string, public name: string) {
    AthleteType.store.set(this.code, this);
  }

}
