import { Pipe, PipeTransform } from '@angular/core';
import { LocalDate } from '@js-joda/core';
import { parseLocalDateToRussianDate } from './utils';

@Pipe({ standalone: true, name: 'toRusDate' })
export class RussianDatePipe
  implements PipeTransform {

  transform(value: LocalDate | undefined): string {
    if (value === undefined) {
      return '';
    }
    return parseLocalDateToRussianDate(value);
  }

}
