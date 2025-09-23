import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { DictionaryService } from '../../components/dictionaries/dictionary.service';
import { CityModel } from '../../models/city.model';
import { CityType } from '../../models/enums/city-type.enum';
import { resolveEnum } from '../../utils/utils';

@Component({
             selector: 'app-add-race-type-dialog',
             imports: [
               MatFormFieldModule, MatInputModule,
               RouterLink, MatButton, FormsModule,
               MatDialogActions, MatDialogContent, MatDialogTitle, NgForOf, ReactiveFormsModule, MatSelect, MatOption,
             ],
             templateUrl: './add-city-dialog.component.html',
             standalone: true,
             styleUrl: './add-city-dialog.component.css',
           })
export class AddCityDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddCityDialogComponent>);
  form = this.fb.group({
                         type: ['', Validators.required],
                         name: ['', Validators.required],
                       });

  types: CityType[] = CityType.store.values();

  constructor(private service: DictionaryService) {
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;

      const model = new CityModel();
      model.type = resolveEnum(formValue.type!, CityType.store);
      model.name = formValue.name!;
      this.service.createCity(model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
