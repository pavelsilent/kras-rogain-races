import { RaceFormatTokenDTO } from '../api/index';
import { exists, resolveEnum } from '../utils/utils';
import { TokenType } from './enums/token-type.enum';

export class RaceFormatTokenModel {
  raceId: number;
  raceFormatId: number
  token: string;
  tokenType: TokenType;

  constructor(dto?: RaceFormatTokenDTO) {
    if (exists(dto)) {
      this.raceId = dto.raceId;
      this.raceFormatId = dto.raceFormatId;
      this.token = dto.token;
      this.tokenType = resolveEnum(dto.tokenType, TokenType.store);
    }
  }

  static fromDTO(dto?: RaceFormatTokenDTO) {
    return new RaceFormatTokenModel(dto);
  }

}
