import { LocalDateTime } from '@js-joda/core';
import { RaceFormatCheckPointSetupDTO } from '../api/index';

export class RaceCheckPointSetupModel {
  id: number;
  orderNumber: number;
  name: string;
  description?: string;
  totalDistance?: number;
  checkTime?: LocalDateTime;
  leaderTime?: LocalDateTime;

  toDTO(): RaceFormatCheckPointSetupDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      totalDistance: this.totalDistance,
      orderNumber: this.orderNumber,
      //@ts-ignore
      checkTime: this.checkTime,
      //@ts-ignore
      leaderTime: this.leaderTime,
    };
  }
}
