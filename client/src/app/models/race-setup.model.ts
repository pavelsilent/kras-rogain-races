import { LocalDate } from '@js-joda/core';
import { RaceSetupDTO } from '../api/index';

export class RaceSetupModel {
  id: number;
  name: string;
  description?: string;
  date?: LocalDate;
  typeId: number;
  cityId: number;

  toDTO(): RaceSetupDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      // @ts-ignore
      date: this.date,
      raceTypeId: this.typeId,
      cityId: this.cityId,
    };
  }
}
