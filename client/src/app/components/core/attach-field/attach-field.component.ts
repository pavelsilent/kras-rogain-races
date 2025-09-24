import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
             selector: 'app-attach-field',
             imports: [
               MatLabel,
               MatFormField,
               MatIcon,
               MatIconButton,
               MatInput,
               MatSuffix,
             ],
             templateUrl: './attach-field.component.html',
             standalone: true,
             styleUrl: './attach-field.component.css',
             providers: [
               {
                 provide: NG_VALUE_ACCESSOR,
                 useExisting: forwardRef(() => AttachFieldComponent),
                 multi: true,
               },
             ],
           })
export class AttachFieldComponent
  implements ControlValueAccessor {
  fileName = '';
  previewUrl: string | ArrayBuffer | null = null;
  file: File | null = null;

  private onChange: (value: File | null) => void = () => {
  };
  private onTouched: () => void = () => {
  };

  writeValue(value: File | null): void {
    this.file = value;
    if (value) {
      this.fileName = value.name;
      const reader = new FileReader();
      reader.onload = () => (this.previewUrl = reader.result);
      reader.readAsDataURL(value);
    } else {
      this.fileName = '';
      this.previewUrl = null;
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // пока просто disable не поддерживаем, можно добавить [disabled] на input
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    this.file = input.files[0];
    this.fileName = this.file.name;

    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(this.file);

    this.onChange(this.file);
    this.onTouched();
  }
}
