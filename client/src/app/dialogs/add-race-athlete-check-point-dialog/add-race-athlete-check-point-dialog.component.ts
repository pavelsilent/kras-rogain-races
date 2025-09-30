import { NgForOf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Option } from 'funfix-core';
import { RaceService } from '../../components/race/race.service';
import { RaceAthleteCheckPointModel } from '../../models/race-athlete-check-point.model';
import { RaceCheckPointModel } from '../../models/race-check-point.model';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import {
  exists, hasLength,
  localDateTimeToMoment,
  localDateToMoment,
  parseLocalDateTimeFromMoment,
  parseLocalDateTimeToRussianTime,
} from '../../utils/utils';

export interface AddRaceAthleteCheckPointDialogConfig {
  raceId: number;
  raceFormatId: number;
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
  checkPointIdControl;
  checkPointDateControl;
  checkPointTimeControl;
  checkPoints: RaceCheckPointModel[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddRaceAthleteCheckPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceAthleteCheckPointDialogConfig,
    private service: RaceService,
  ) {
    this.checkPoints = data.checkPoints;
    this.checkPointDateControl = new FormControl(localDateToMoment(data.raceDate));
    this.checkPointTimeControl = new FormControl('');
    this.checkPointIdControl =  new FormControl(NaN, Validators.required);
    this.form = this.fb.group({
                                athleteBibNumber: [data.athleteBibNumber, Validators.required],
                                checkPointId: this.checkPointIdControl,
                                checkPointDate: this.checkPointDateControl,
                                checkPointTime: this.checkPointTimeControl,
                              });
    if (exists(data.athleteBibNumber)) {
      service.getRaceAthleteNextCheckPoint(data.raceId, data.raceFormatId, data.athleteBibNumber)
        .then(value => this.checkPointIdControl.setValue(value))
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
        this.checkPointDateControl.setValue(Option.of(localDateTimeToMoment(value.time!))
                                                  .getOrElse(localDateToMoment(this.data.raceDate)));
        this.checkPointTimeControl.setValue(parseLocalDateTimeToRussianTime(value.time!));
      });
    }
  }
}
