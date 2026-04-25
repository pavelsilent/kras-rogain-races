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
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { LocalDateTime, ZonedDateTime, ZoneOffset } from '@js-joda/core';
import { RaceService } from '../../components/race/race.service';
import { RaceState } from '../../models/enums/race-state.enum';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import {
  exists,
  localDateToMoment,
  parseLocalDateTimeFromMoment,
  parseLocalTimeToRussianTime,
} from '../../utils/utils';

export interface SetRaceStateDialogConfig {
  raceId: number;
  raceFormatId: number;
  state: RaceState;
  stateDateTime: LocalDateTime,
  customStateDateTime: LocalDateTime,
}

@Component({
             selector: 'app-set-race-state.component',
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
               MatDatepickerInput,
               MatDatepickerToggle,
               MatDatepicker,
               MatMomentDateModule,
               MatIconModule,
               MatSuffix,
             ],
             templateUrl: './set-race-state-dialog.component.html',
             standalone: true,
             styleUrl: './set-race-state-dialog.component.css',
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
           })
export class SetRaceStateDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SetRaceStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SetRaceStateDialogConfig,
    private service: RaceService,
  ) {

    this.form = this.fb.group({
                                state: [data.state.name, Validators.required],
                                stateDate: [this.resolveStateDate(), Validators.required],
                                stateTime: [this.resolveStateTime(), Validators.required],
                              });
  }

  resolveStateDate() {
    if (!exists(this.data?.customStateDateTime)) {
      return localDateToMoment(this.data.stateDateTime.toLocalDate());
    }
    return localDateToMoment(this.data.customStateDateTime.toLocalDate());
  }

  resolveStateTime() {
    if (!exists(this.data?.customStateDateTime)) {
      const now = ZonedDateTime.now(ZoneOffset.ofHours(7));
      return parseLocalTimeToRussianTime(now.toLocalTime());
    }
    return parseLocalTimeToRussianTime(this.data.customStateDateTime.toLocalTime());
  }

  onSave(): void {
    if (this.form.valid) {
      let value = this.form.value;
      this.service.setRaceState(
        this.data.raceId,
        this.data.raceFormatId,
        this.data.state.code,
        parseLocalDateTimeFromMoment(value.stateDate, value.stateTime)!,
      )
          .then(value => this.dialogRef.close(value));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
