import { Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { MatFormField, MatInput } from '@angular/material/input';

@Component({
             selector: 'app-duration-field',
             standalone: true,
             templateUrl: './duration-field.component.html',
             styleUrl: './duration-field.component.css',
             imports: [
               MatLabel,
               MatInput,
               MatFormField,
             ],
             providers: [
               {
                 provide: NG_VALUE_ACCESSOR,
                 useExisting: forwardRef(() => DurationFieldComponent),
                 multi: true
               },
             ],
           })
export class DurationFieldComponent
  implements ControlValueAccessor {
  hours = 0;
  minutes = 0;
  seconds = 0;

  private onChange: (val: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    if (!value) {
      this.hours = this.minutes = this.seconds = 0;
    } else {
      const [h, m, s] = value.split(':').map(v => Number(v) || 0);
      this.hours = h;
      this.minutes = Math.min(m, 59);
      this.seconds = Math.min(s, 59);
    }
  }

  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }

  private emitChange() {
    const hh = this.hours.toString().padStart(2,'0');
    const mm = this.minutes.toString().padStart(2,'0');
    const ss = this.seconds.toString().padStart(2,'0');
    this.onChange(`${hh}:${mm}:${ss}`);
  }

  onHours(event: Event) {
    const val = Number((event.target as HTMLInputElement).value);
    this.hours = Math.max(0, val || 0);
    this.emitChange();
  }

  onMinutes(event: Event) {
    let val = Number((event.target as HTMLInputElement).value);
    this.minutes = Math.max(0, Math.min(59, val || 0));
    this.emitChange();
  }

  onSeconds(event: Event) {
    let val = Number((event.target as HTMLInputElement).value);
    this.seconds = Math.max(0, Math.min(59, val || 0));
    this.emitChange();
  }
}
