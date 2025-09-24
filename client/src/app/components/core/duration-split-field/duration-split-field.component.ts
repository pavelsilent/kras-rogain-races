import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
             selector: 'app-duration-split-field',
             imports: [
               MatLabel,
               MatFormField,
               MatInput,
               FormsModule,
               MatDatepicker,
               MatDatepickerInput,
               MatDatepickerToggle,
               MatSuffix,
               ReactiveFormsModule,
             ],
             templateUrl: './duration-split-field.component.html',
             standalone: true,
             styleUrl: './duration-split-field.component.css',
             providers: [
               {
                 provide: NG_VALUE_ACCESSOR,
                 useExisting: forwardRef(() => DurationSplitFieldComponent),
                 multi: true,
               },
             ],
           })
export class DurationSplitFieldComponent
  implements ControlValueAccessor {

  @Input()
  label = '';
  hours: string = '';
  minutes: string = '';
  seconds: string = '';

  private onChange: (value: string) => void = () => {
  };
  protected onTouched: () => void = () => {
  };

  writeValue(value: string | null): void {
    if (value) {
      const [hh, mm, ss] = value.split(':');
      this.hours = hh ?? '';
      this.minutes = mm ?? '';
      this.seconds = ss ?? '';
    } else {
      this.hours = this.minutes = this.seconds = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onMinutesInput(event: any) {
    const value = Number(event.target.value);
    if (value > 59) {
      event.target.value = '59';
      this.minutes = '59';
    }
    this.updateValue();

  }

  onSecondsInput(event: any) {
    const value = Number(event.target.value);
    if (value > 59) {
      event.target.value = '59';
      this.seconds = '59';
    }
    this.updateValue();
  }

  updateValue(): void {
    const hh = this.hours.padStart(2, '0') || '00';
    const mm = this.minutes.padStart(2, '0') || '00';
    const ss = this.seconds.padStart(2, '0') || '00';
    this.onChange(`${hh}:${mm}:${ss}`);
  }
}
