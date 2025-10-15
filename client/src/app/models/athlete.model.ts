import { LocalDate } from '@js-joda/core';
import { AthleteDTO } from '../api/index';
import { exists, hasLength, parseLocalDate, resolveEnumOrDefault } from '../utils/utils';
import { CityModel } from './city.model';
import { Sex } from './enums/sex.enum';

export class AthleteModel {
  id?: number;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  sex?: Sex;
  birthDate?: LocalDate;
  city?: CityModel;
  club?: string;

  constructor(dto?: AthleteDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.firstName = dto.firstName;
      this.lastName = dto.lastName;
      this.middleName = dto.middleName;
      this.sex = resolveEnumOrDefault(dto.sex, Sex.store, undefined);
      this.birthDate = parseLocalDate(dto.birthDate);
      this.club = dto.club;
      this.city = CityModel.fromDTO(dto.city);
    }
  }

  public getShortFIO() {
    return this.lastName + ' ' + this.firstName?.charAt(0) + '.';
  }

  public getFIO() {
    let fio = this.lastName + ' ' + this.firstName;
    if (hasLength(this.middleName)) {
      fio += ' ' + this.middleName;
    }
    return fio;
  }

  static fromDTO(dto?: AthleteDTO) {
    return new AthleteModel(dto);
  }

  toDTO(): AthleteDTO {
    return {
      id: this.id,
      firstName: this.firstName!,
      lastName: this.lastName!,
      middleName: this.middleName,
      // @ts-ignore
      birthDate: this.birthDate,
      // @ts-ignore
      sex: this.sex?.code,
      city: this.city?.toDTO(),
      club: this.club,
    };
  }
}
