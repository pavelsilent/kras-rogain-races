import { Pipe, PipeTransform } from '@angular/core';
import { Enum } from './enum';

@Pipe({ standalone: true, name: 'toEnumName' })
export class EnumPipe
  implements PipeTransform {

  transform(value: Enum | undefined): string {
    if (value === undefined) {
      return '';
    }
    return value.name;
  }

}
