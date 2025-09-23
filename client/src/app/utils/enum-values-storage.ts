import { Option } from 'funfix-core';
import { hasLength } from './utils';

/**
 * Хранилище значений енама, позволяет искать, сохранять и трансформировать в массив и сет значения енама
 */
export class EnumValuesStorage<T> {
  private valuesMap: Map<string, T> = new Map();

  set(external: string, value: T) {
    this.valuesMap.set(external, value);
  }

  get(external: string, exceptionText: string = `Unknown enum value ${external}`): T {
    const value = this.find(external);
    if (value.isEmpty()) {
      throw new Error(exceptionText);
    }
    return value.get();
  }

  find(external: string): Option<T> {
    return Option.of(this.valuesMap.get(external));
  }

  values(): T[] {
    return Array.from(this.valuesMap.values());
  }

  /**
   * Возвращает Set элементов енама на основе массива кодов
   * @param codes Массив кодов енама
   * @param [strict=true] Как себя вести с незнакомыми кодами, в случае true будет выкинуто исключение, в случае false
   *     такой  код будет проигнорирован
   * @return Set с элементами енама
   */
  toSet(codes: string[], strict = true): Set<T> {
    const res = new Set<T>();
    if (!hasLength(codes)) {
      return res;
    }
    if (strict) {
      codes.forEach(code => res.add(this.get(code)));
    } else {
      codes.forEach(code => this.find(code).forEach(val => res.add(val)));
    }
    return res;
  }
}
