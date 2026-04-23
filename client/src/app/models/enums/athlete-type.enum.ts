import { Enum } from '../../utils/enum';
import { EnumValuesStorage } from '../../utils/enum-values-storage';

export class AthleteType
  implements Enum {
  static store: EnumValuesStorage<AthleteType> = new EnumValuesStorage();

  static ATHLETE = new AthleteType('ATHLETE', 'Атлет');
  static ATHLETE_TEAM = new AthleteType('ATHLETE_TEAM', 'Команда');
  static LEADER = new AthleteType('LEADER', 'Прогнозируемый лидер');
  static CONTROL = new AthleteType('CONTROL', 'Контрольное время');

  constructor(public code: string, public name: string) {
    AthleteType.store.set(this.code, this);
  }

}
