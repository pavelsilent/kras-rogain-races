import { Pipe, PipeTransform } from '@angular/core';
import { LocalDateTime, LocalTime } from '@js-joda/core';
import { parseLocalDateTimeToRussianTime, parseLocalTimeToRussianTime } from './utils';

@Pipe({ standalone: true, name: 'toRusTime' })
export class RussianTimePipe
  implements PipeTransform {

  transform(value: LocalDateTime | LocalTime | undefined): string {
    if (value === undefined) {
      return '';
    }
    if (value instanceof LocalDateTime) {
      return parseLocalDateTimeToRussianTime(value);
    }
    return parseLocalTimeToRussianTime(value);
  }

}
