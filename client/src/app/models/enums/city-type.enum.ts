import { Enum } from '../../utils/enum';
import { EnumValuesStorage } from '../../utils/enum-values-storage';

export class CityType
  implements Enum {
  static store: EnumValuesStorage<CityType> = new EnumValuesStorage();

  static CITY = new CityType('CITY', 'Город', 'г.');
  static TOWN = new CityType('TOWN', 'Поселок', 'п.');
  static VILLAGE = new CityType('VILLAGE', 'Село', 'c.');
  static URBAN = new CityType('URBAN', 'Поселок городского типа', 'пгт.');
  static STATION = new CityType('STATION', 'Станция', 'ст.');
  static OTHER = new CityType('OTHER', 'Другое', '');

  constructor(public code: string, public name: string, public shortName: string) {
    CityType.store.set(this.code, this);
  }
}
