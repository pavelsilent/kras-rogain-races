import { Pipe, PipeTransform } from '@angular/core';
import { hasLength } from './utils';

@Pipe({ standalone: true, name: 'joinList' })
export class BoolPipe
  implements PipeTransform {

  transform<T>(value: T[] | undefined | null): string {
    if (value === undefined || value === null || !hasLength(value)) {
      return '';
    }

    return value.join(', ');
  }

}
