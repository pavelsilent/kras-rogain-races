import { Pipe, PipeTransform } from '@angular/core';
import { LocalDateTime, LocalTime } from '@js-joda/core';
import { format } from './utils';

@Pipe({ standalone: true, name: 'toCosmicTime' })
export class CosmicTimePipe
  implements PipeTransform {

  transform(value: LocalDateTime | LocalTime | undefined): string {
    if (value === undefined) {
      return '';
    }
    return format(value, '(HH:mm)');
  }

}
