import { EnumValuesStorage } from '../../utils/enum-values-storage';
import { Enum } from '../../utils/enum';

export class AthleteField
  implements Enum {
  static store: EnumValuesStorage<AthleteField> = new EnumValuesStorage();

  static FIRST_NAME = new AthleteField('firstName', 'Имя');
  static LAST_NAME = new AthleteField('lastName', 'Фамилия');
  static MIDDLE_NAME = new AthleteField('middleName', 'Отчество');
  static BIRTH_DATE = new AthleteField('birthDate', 'Дата рождения');
  static SEX = new AthleteField('sex', 'Пол');
  static CITY = new AthleteField('city', 'Город');
  static CLUB = new AthleteField('club', 'Клуб');

  constructor(public code: string, public name: string) {
    AthleteField.store.set(this.code, this);
  }
}
