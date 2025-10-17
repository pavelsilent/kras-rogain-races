import { Pipe, PipeTransform } from '@angular/core';
import { LocalDateTime } from '@js-joda/core';
import { parseLocalDateTimeToRussianDateTimeShort } from './utils';

@Pipe({ standalone: true, name: 'toRusDateTime' })
export class RussianDateTimePipe
  implements PipeTransform {

  transform(value: LocalDateTime | undefined): string {
    if (value === undefined) {
      return "";
    }
    return parseLocalDateTimeToRussianDateTimeShort(value);
  }

}
