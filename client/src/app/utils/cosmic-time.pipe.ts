import { Pipe, PipeTransform } from '@angular/core';
import { LocalDateTime, LocalTime } from '@js-joda/core';
import { format } from './utils';

@Pipe({ standalone: true, name: 'toCosmicTime' })
export class CosmicTimePipe
  implements PipeTransform {

  transform(value: LocalDateTime | LocalTime | undefined, needBrackets: boolean = true): string {
    if (value === undefined) {
      return '';
    }
    if (needBrackets) {
      return format(value, '(HH:mm)');
    }
    return format(value, 'HH:mm');
  }

}
