import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ standalone: true, name: 'toRusBool' })
export class BoolPipe
  implements PipeTransform {

  transform(value: boolean): string {
    if (value === undefined || value === null) {
      return 'Нет';
    }
    return value ? 'Да' : 'Нет';
  }

}
