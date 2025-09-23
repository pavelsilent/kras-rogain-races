import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { AthletesService } from '../../components/athlete-list/athletes.service';
import { AthleteModel } from '../../models/athlete.model';
import { Sex } from '../../models/enums/sex.enum';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { parseLocalDate, resolveEnumOrDefault } from '../../utils/utils';

@Component({
             selector: 'app-add-athlete-dialog',
             imports: [
               MatFormField,
               MatSelect,
               MatOption,
               NgForOf,
               ReactiveFormsModule,
               MatDialogContent,
               MatDialogTitle,
               MatInput,
               MatDatepickerInput,
               MatDatepickerToggle,
               MatDatepicker,
               MatDialogActions,
               MatButton,
               MatLabel,
               MatMomentDateModule,
               MatIconModule,
               MatPrefix,
               MatSuffix,
             ],
             templateUrl: './add-athlete-dialog.component.html',
             standalone: true,
             styleUrl: './add-athlete-dialog.component.css',
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
           })
export class AddAthleteDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddAthleteDialogComponent>);
  sexes: Sex[] = Sex.store.values();
  form = this.fb.group({
                         lastName: ['', Validators.required],
                         firstName: ['', Validators.required],
                         middleName: ['', Validators.required],
                         birthDate: [undefined, Validators.required],
                         sex: [undefined, Validators.required],
                         city: [''],
                         club: [''],
                       });

  constructor(private service: AthletesService) {
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;

      const model = new AthleteModel();
      model.firstName = formValue.firstName!;
      model.lastName = formValue.lastName!;
      model.middleName = formValue.middleName || undefined;
      model.sex = resolveEnumOrDefault(formValue.sex!, Sex.store, undefined);
      model.birthDate = parseLocalDate(formValue.birthDate!);
      model.club = formValue.club || undefined;
      model.city = formValue.city || undefined;
      this.service.createAthlete(model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
