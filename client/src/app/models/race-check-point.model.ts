import { LocalDateTime } from '@js-joda/core';
import { RaceFormatCheckPointDTO } from '../api/index';
import { exists, parseLocalDateTime } from '../utils/utils';

export class RaceCheckPointModel {
  id: number;
  orderNumber: number;
  name: string;
  description?: string;
  totalDistance?: number;
  diffDistance?: number;
  diffSpeed?: number;
  totalAltitude?: number;
  diffAscent?: number;
  diffDescent?: number;
  checkDuration?: string;
  checkTime?: LocalDateTime;
  leaderDuration?: string;
  leaderTime?: LocalDateTime;
  leaderDiffDuration?: string;
  isStart: boolean;
  isFinish: boolean;
  hasCheckTime: boolean;
  open: boolean = false;

  constructor(dto?: RaceFormatCheckPointDTO) {
    if (exists(dto)) {
      this.id = dto.id;
      this.orderNumber = dto.orderNumber;
      this.name = dto.name;
      this.description = dto.description;
      this.totalDistance = dto.totalDistance;
      this.diffDistance = dto.diffDistance;
      this.diffSpeed = dto.diffSpeed;
      this.totalAltitude = dto.totalAltitude;
      this.diffAscent = dto.diffAscent;
      this.diffDescent = dto.diffDescent;
      this.isStart = dto.isStart;
      this.isFinish = dto.isFinish;
      this.hasCheckTime = dto.hasCheckTime;
      this.checkDuration = dto.checkDuration;
      this.checkTime = parseLocalDateTime(dto.checkTime);
      this.leaderDuration = dto.leaderDuration;
      this.leaderTime = parseLocalDateTime(dto.leaderTime);
      this.leaderDiffDuration = dto.leaderDiffDuration;
    }
  }

  static fromDTO(dto?: RaceFormatCheckPointDTO) {
    return new RaceCheckPointModel(dto);
  }

  toDTO(): RaceFormatCheckPointDTO {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      totalDistance: this.totalDistance,
      orderNumber: this.orderNumber,
      isStart: this.isStart,
      isFinish: this.isFinish,
      hasCheckTime: this.hasCheckTime,
      //@ts-ignore
      checkTime: this.checkDuration,
      //@ts-ignore
      leaderTime: this.leaderDuration,
    };
  }
}
