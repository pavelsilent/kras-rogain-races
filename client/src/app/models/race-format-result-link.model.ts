import { LocalDate } from '@js-joda/core';
import { RaceFormatResultLinkDTO } from '../api/index';
import { exists, parseLocalDate, resolveEnum } from '../utils/utils';
import { RaceState } from './enums/race-state.enum';
import { RaceTypeModel } from './race-type.model';

export class RaceFormatResultLinkModel {
  id: number;
  raceName: string;
  formatName: string;
  type: RaceTypeModel;
  state: RaceState;
  raceDate?: LocalDate;
  viewToken?: string;

  constructor(dto?: RaceFormatResultLinkDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.raceName = dto.raceName;
      this.formatName = dto.formatName;
      this.type = RaceTypeModel.fromDTO(dto.raceType);
      this.state = resolveEnum(dto.state!, RaceState.store);
      this.viewToken = dto.viewToken;
      this.raceDate = parseLocalDate(dto.raceDate);}
  }

  static fromDTO(dto?: RaceFormatResultLinkDTO) {
    return new RaceFormatResultLinkModel(dto);
  }
}
