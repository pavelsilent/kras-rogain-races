import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
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
import { MatFormField, MatFormFieldModule, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { LocalDate, LocalDateTime } from '@js-joda/core';
import { Option } from 'funfix-core';
import moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { RaceService } from '../../components/race/race.service';
import { RaceAthleteCheckPointModel } from '../../models/race-athlete-check-point.model';
import { RaceCheckPointModel } from '../../models/race-check-point.model';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import {
  exists,
  hasLength,
  localDateTimeToMoment,
  localDateToMoment,
  parseLocalDateTimeFromMoment,
  parseLocalDateTimeToRussianDateTime,
  parseLocalDateTimeToRussianTime,
} from '../../utils/utils';

export interface AddRaceAthleteCheckPointDialogConfig {
  raceId: number;
  raceFormatId: number;
  checkPoints: RaceCheckPointModel[];
  raceDate: LocalDate;
  athleteBibNumber?: number;
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
               MatFormFieldModule,
               MatInputModule,
               MatPrefix,
               MatSuffix,
               NgIf,
               AsyncPipe,
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
  checkPointIdControl;
  checkPointDateControl;
  checkPointTimeControl;
  checkPoints: RaceCheckPointModel[] = [];
  validatorMessage$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRaceAthleteCheckPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceAthleteCheckPointDialogConfig,
    private service: RaceService,
  ) {
    this.checkPoints = data.checkPoints;
    this.checkPointDateControl = new FormControl(localDateToMoment(data.raceDate));
    this.checkPointTimeControl = new FormControl('');
    this.checkPointIdControl = new FormControl(NaN, Validators.required);
    this.form = this.fb.group({
                                athleteBibNumber: [data.athleteBibNumber, Validators.required],
                                checkPointId: this.checkPointIdControl,
                                checkPointDate: this.checkPointDateControl,
                                checkPointTime: this.checkPointTimeControl,
                              });
    if (exists(data.athleteBibNumber)) {
      service.getRaceAthleteNextCheckPoint(data.raceId, data.raceFormatId, data.athleteBibNumber)
             .then(value => {
               this.checkPointIdControl.setValue(value);
               this.onSelectCheckPoint(value);
             });
    }
  }

  onSave(): void {
    if (this.form.valid) {
      let value = this.form.value;

      let model = new RaceAthleteCheckPointModel();
      model.id = value.checkPointId;
      model.athleteBibNumber = value.athleteBibNumber;
      if (exists(value.checkPointDate) && hasLength(value.checkPointTime)) {
        model.time = parseLocalDateTimeFromMoment(value.checkPointDate, value.checkPointTime);
      }
      model.passed = exists(model.time);
      this.service.addRaceAthleteCheckPoint(this.data.raceId, this.data.raceFormatId, model)
          .then(value => this.dialogRef.close(value));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelectCheckPoint(checkPointId: number) {
    let athleteBibNumber = this.form.value.athleteBibNumber;
    if (exists(checkPointId) && exists(athleteBibNumber)) {
      this.service.getRaceAthleteCheckPoint(
        this.data.raceId,
        this.data.raceFormatId,
        athleteBibNumber,
        checkPointId,
      ).then(value => {

        let prevRusDateTime = parseLocalDateTimeToRussianDateTime(value.prevPointTime);
        let nextRusDateTime = parseLocalDateTimeToRussianDateTime(value.nextPointTime);
        let message = ' ';
        if (hasLength(prevRusDateTime) && hasLength(nextRusDateTime)) {
          message = 'Значение должно быть между ' + prevRusDateTime + ' и ' + nextRusDateTime + '.';
        } else if (hasLength(prevRusDateTime)) {
          message = 'Значение должно быть больше ' + prevRusDateTime + '.';
        } else if (hasLength(nextRusDateTime)) {
          message = 'Значение должно быть меньше ' + nextRusDateTime + '.';
        }
        this.validatorMessage$.next(message);

        let checkPointTime = value?.data?.time;
        this.checkPointDateControl.setValue(Option.of(localDateTimeToMoment(checkPointTime!))
                                                  .getOrElse(localDateToMoment(this.data.raceDate)));

        this.checkPointDateControl.setValidators([
                                                   this.momentDateRangeValidator(
                                                     value.prevPointTime,
                                                     value.nextPointTime,
                                                   ),
                                                 ]);
        this.checkPointDateControl.markAsTouched();
        this.checkPointDateControl.updateValueAndValidity();

        this.checkPointTimeControl.setValue(parseLocalDateTimeToRussianTime(checkPointTime!));
        this.checkPointTimeControl.setValidators([this.timeRangeValidator(value.prevPointTime, value.nextPointTime)]);
        this.checkPointTimeControl.markAsTouched();
        this.checkPointTimeControl.updateValueAndValidity();
      });
    }
  }

  private timeRangeValidator(min: LocalDateTime, max: LocalDateTime) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = this.checkPointDateControl.value;
      if (!exists(date)) {
        return null;
      }

      const time = control.value;
      const dateTime = parseLocalDateTimeFromMoment(date, time);

      if (exists(min) && !exists(max)) {
        if (dateTime?.isBefore(min)) {
          return { timeRange: true };
        }
      } else if (!exists(min) && exists(max)) {
        if (dateTime?.isAfter(max)) {
          return { timeRange: true };
        }
      } else if (exists(min) && exists(max)) {
        if (dateTime?.isBefore(min) || dateTime?.isAfter(max)) {
          return { timeRange: true };
        }
      }
      return null;
    };
  }

  private momentDateRangeValidator(min?: LocalDateTime, max?: LocalDateTime) {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const date = moment(value);
      let time = this.checkPointTimeControl.value;
      if (!hasLength(time)) {
        time = '00:00:00';
      }
      const dateTime = parseLocalDateTimeFromMoment(date, time!);

      if (exists(min) && !exists(max)) {
        if (dateTime?.isBefore(min)) {
          return { timeRange: true };
        }
      } else if (!exists(min) && exists(max)) {
        if (dateTime?.isAfter(max)) {
          return { timeRange: true };
        }
      } else if (exists(min) && exists(max)) {
        if (dateTime?.isBefore(min) || dateTime?.isAfter(max)) {
          return { timeRange: true };
        }
      }
      return null;
    };
  }

  validateDateTime($event: any) {
    this.checkPointDateControl.updateValueAndValidity();
    this.checkPointTimeControl.updateValueAndValidity();
  }

}
