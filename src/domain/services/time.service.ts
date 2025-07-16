import type { ITimeService } from "../interfaces/time-service.interface";

export class TimeService implements ITimeService {
  private readonly frozenTime = new Date('2030-03-14T15:14:00');
  
  getCurrentTime(): Date {
    return new Date();
  }
  
  getFrozenTime(): Date {
    return this.frozenTime;
  }
}