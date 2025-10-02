import { EnumValuesStorage } from '../../utils/enum-values-storage';

export class RaceState {
  static store: EnumValuesStorage<RaceState> = new EnumValuesStorage();

  static DRAFT = new RaceState('DRAFT', 'Черновик');
  static PLANNED = new RaceState('PLANNED', 'Запланирована');
  static REGISTRATION_STARTED = new RaceState('REGISTRATION_STARTED', 'Регистрация открыта');
  static REGISTRATION_FINISHED = new RaceState('REGISTRATION_FINISHED', 'Регистрация завершена');
  static STARTED = new RaceState('STARTED', 'Стартовала');
  static FINISHED = new RaceState('FINISHED', 'Закончена');
  static CANCELED = new RaceState('CANCELED', 'Отменена');

  constructor(public code: string, public name: string) {
    RaceState.store.set(this.code, this);
  }
}
