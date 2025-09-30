import { Enum } from '../../utils/enum';
import { EnumValuesStorage } from '../../utils/enum-values-storage';

export class TokenType
  implements Enum {
  static store: EnumValuesStorage<TokenType> = new EnumValuesStorage();

  static VIEW = new TokenType('VIEW', 'Просмотр');
  static EDIT = new TokenType('EDIT', 'Редактирование');

  constructor(public code: string, public name: string) {
    TokenType.store.set(this.code, this);
  }
}
