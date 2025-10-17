import { EnumValuesStorage } from '../../utils/enum-values-storage';
import { Enum } from '../../utils/enum';

export class AthleteState
  implements Enum {
  static store: EnumValuesStorage<AthleteState> = new EnumValuesStorage();

  static REGISTERED = new AthleteState('REGISTERED', 'Зарегистрирован');
  static STARTED = new AthleteState('STARTED', 'Стартовал');
  static FINISHED = new AthleteState('FINISHED', 'Финишировал');
  static DISQUALIFIED = new AthleteState('DISQUALIFIED', 'Снят');
  static DID_NOT_START = new AthleteState('DID_NOT_START', 'Не стартовал');
  static DID_NOT_FINISH = new AthleteState('DID_NOT_FINISH', 'Не финишировал');
  static NOT_DATA = new AthleteState('NOT_DATA', 'Нет данных');

  constructor(public code: string, public name: string) {
    AthleteState.store.set(this.code, this);
  }

}
