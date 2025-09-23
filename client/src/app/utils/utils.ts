import { DateTimeFormatter, LocalDate, LocalDateTime, LocalTime, Temporal } from '@js-joda/core';
import { Option } from 'funfix-core';
import moment, { Moment } from 'moment';
import { Enum } from './enum';
import { EnumValuesStorage } from './enum-values-storage';

export function exists<T>(input: T): input is (Exclude<T, null | undefined | ''>) {
  return !isUndefined(input) && !isNull(input) && !isEmptyString(input);
}

export function isUndefined(input: any): input is undefined {
  return input === undefined;
}

export function isNull(input: any): input is null {
  return input === null;
}

export function isEmptyString(input: any): input is '' {
  return input === '';
}

export function hasLength(input: string | any[] | null | undefined): boolean {
  return exists(input) && input.length > 0;
}

export function parseLocalDateToRussianDate(value: LocalDate): string {
  return format(value, 'dd.MM.yyyy');
}

export function parseLocalDateTimeToRussianDateTime(value: LocalDateTime): string {
  return format(value, 'dd.MM.yyyy HH:mm:ss');
}

export function parseLocalDateTimeToRussianTime(value: LocalDateTime): string {
  return format(value, 'HH:mm:ss');
}

export function parseLocalTimeToRussianTime(value: LocalTime): string {
  return format(value, 'HH:mm:ss');
}

export function format(value: Temporal, formatPattern: string): string {
  const formatter = DateTimeFormatter.ofPattern(formatPattern);
  // @ts-ignore
  return exists(value) ? formatter.format(value) : null;
}

export function parseLocalDateTime(data: string | undefined): LocalDateTime | undefined {
  if (!hasLength(data)) {
    return undefined;
  }
  return LocalDateTime.parse(data as unknown as string);
}

export function parseLocalDate(data: string | undefined | Moment): LocalDate | undefined {
  if (moment.isMoment(data)) {
    return LocalDate.of(data.year(), data.month() + 1, data.date());
  }

  if (!exists(data)) {
    return undefined;
  }

  if (!hasLength(data)) {
    return undefined;
  }
  return LocalDate.parse(data as unknown as string);
}

export function localDateTimeToMoment(localDateTime: LocalDateTime) {
  if (!exists(localDateTime)) {
    return null;
  }

  return moment({
                  year: localDateTime.year(),
                  month: localDateTime.monthValue() - 1,
                  day: localDateTime.dayOfMonth(),
                  hour: 0,
                  minute: 0,
                  second: 0,
                });
}

export function localDateToMoment(localDate: LocalDate) {
  if (!exists(localDate)) {
    return null;
  }

  return moment({
                  year: localDate.year(),
                  month: localDate.monthValue() - 1,
                  day: localDate.dayOfMonth(),
                });
}

export function parseLocalDateTimeFromMoment(moment: Moment, time: string): LocalDateTime | undefined {
  if (!exists(moment)) {
    return undefined;
  }

  let localTime = LocalTime.of(0, 0, 0);
  if (hasLength(time)) {
    localTime = LocalTime.parse(time);
  }

  return LocalDateTime.of(moment.year(), moment.month() + 1, moment.date(),
                          localTime.hour(), localTime.minute(), localTime.second(),
  );
}

export function resolveEnum(code: string, store: EnumValuesStorage<Enum>) {
  return resolveEnumOrDefault(code, store, undefined);
}

export function resolveEnumOrDefault(code: string, store: EnumValuesStorage<Enum>, defaultValue: any) {
  return Option.of(code).map(item => store.get(item)).getOrElse(defaultValue);
}
