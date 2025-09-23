import { NgForOf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { LocalDate, LocalDateTime } from '@js-joda/core';
import { RaceCheckPointModel } from '../../models/race-check-point.model';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { localDateToMoment, parseLocalDateTimeFromMoment } from '../../utils/utils';

export interface AddRaceAthleteCheckPointDialogConfig {
  checkPoints: RaceCheckPointModel[];
  raceDate: LocalDate;
  athleteBibNumber?: number;
}

export interface AddRaceAthleteCheckPointDialogResult {
  athleteBibNumber: number;
  checkPointId: number;
  checkPointDateTime: LocalDateTime;
}

@Component({
             selector: 'app-add-race-athlete-check-point-dialog',
             imports: [
               MatDialogContent,
               ReactiveFormsModule,
               MatFormField,
               MatDialogActions,
               MatButton,
               MatInput,
               MatLabel,
               MatDialogTitle,
               MatOptionModule,
               MatSelect,
               NgForOf,
               MatDatepickerInput,
               MatDatepickerToggle,
               MatDatepicker,
               MatMomentDateModule,
               MatIconModule,
               MatPrefix,
               MatSuffix,
             ],
             templateUrl: './add-race-athlete-check-point-dialog.component.html',
             standalone: true,
             styleUrl: './add-race-athlete-check-point-dialog.component.css',
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
           })
export class AddRaceAthleteCheckPointDialogComponent {
  form: FormGroup;
  checkPoints: RaceCheckPointModel[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRaceAthleteCheckPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceAthleteCheckPointDialogConfig,
  ) {
    this.checkPoints = data.checkPoints;
    this.form = this.fb.group({
                                athleteBibNumber: [data.athleteBibNumber, Validators.required],
                                checkPointId: [null, [Validators.required]],
                                checkPointDate: [localDateToMoment(data.raceDate), Validators.required],
                                checkPointTime: ['', Validators.required],
                              });
  }

  onSave(): void {
    if (this.form.valid) {
      let value = this.form.value;
      console.log(value);
      this.dialogRef.close({
                             athleteBibNumber: value.athleteBibNumber,
                             checkPointId: value.checkPointId,
                             checkPointDateTime: parseLocalDateTimeFromMoment(
                               value.checkPointDate, value.checkPointTime),
                           });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
