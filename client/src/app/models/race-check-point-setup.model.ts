import { RaceFormatCheckPointSetupDTO } from '../api/index';

export class RaceCheckPointSetupModel {
  id: number;
  orderNumber: number;
  name: string;
  description?: string;
  totalDistance?: number;
  totalAltitude?: number;
  diffAscent?: number;
  diffDescent?: number;
  checkDuration?: string;
  leaderDuration?: string;

  toDTO(): RaceFormatCheckPointSetupDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      totalDistance: this.totalDistance,
      totalAltitude: this.totalAltitude,
      diffAscent: this.diffAscent,
      diffDescent: this.diffDescent,
      orderNumber: this.orderNumber,
      checkDuration: this.checkDuration,
      leaderDuration: this.leaderDuration,
    };
  }
}
