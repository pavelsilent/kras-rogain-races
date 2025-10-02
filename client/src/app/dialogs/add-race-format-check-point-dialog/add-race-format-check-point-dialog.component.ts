import { NgForOf } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerInputEvent,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { LocalDateTime } from '@js-joda/core';
import { DurationSplitFieldComponent } from '../../components/core/duration-split-field/duration-split-field.component';
import { RaceService } from '../../components/race/race.service';
import { RaceCheckPointSetupModel } from '../../models/race-check-point-setup.model';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';

export interface AddRaceFormatCheckPointDialogConfig {
  raceId: number;
  raceFormatId: number;
  startDateTime: LocalDateTime;
}

@Component({
             selector: 'app-add-race-format-check-point-dialog',
             imports: [
               FormsModule,
               MatButton,
               MatDatepicker,
               MatDatepickerInput,
               MatDatepickerToggle,
               MatDialogActions,
               MatDialogContent,
               MatDialogTitle,
               MatFormField,
               MatInput,
               MatLabel,
               MatOption,
               MatSelect,
               NgForOf,
               ReactiveFormsModule,
               MatMomentDateModule,
               MatIconModule,
               MatPrefix,
               MatSuffix,
               MatIconButton,
               MatButtonToggle,
               DurationSplitFieldComponent,
             ],
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
             templateUrl: './add-race-format-check-point-dialog.component.html',
             standalone: true,
             styleUrl: './add-race-format-check-point-dialog.component.css',
           })
export class AddRaceFormatCheckPointDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddRaceFormatCheckPointDialogComponent>);
  form;

  constructor(
    private dialog: MatDialog,
    private service: RaceService,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceFormatCheckPointDialogConfig,
  ) {
    this.form = this.fb.group({
                                orderNumber: new FormControl(
                                  undefined,
                                  [
                                    Validators.required,
                                    Validators.min(1),
                                    Validators.pattern(/^\d+$/),
                                  ],
                                ),
                                name: new FormControl('', Validators.required),
                                description: new FormControl(''),
                                distance: new FormControl(
                                  undefined,
                                  [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)],
                                ),
                                controlDuration: [''],
                                leaderDuration: [''],
                              });

    // Подписка на изменения
    this.form.get('checkDate')?.valueChanges.subscribe(value => {
      console.log('checkDate changed:', value);
    });

    this.form.get('checkTime')?.valueChanges.subscribe(value => {
      console.log('checkTime changed:', value);
    });
  }

  submit() {
    if (this.form.valid) {
      let value = this.form.value;

      const model = new RaceCheckPointSetupModel();
      model.orderNumber = value.orderNumber!;
      model.name = value.name!;
      model.description = value.description!;
      model.totalDistance = value.distance!;
      model.checkDuration = value.controlDuration!;
      model.leaderDuration = value.leaderDuration!;
      console.log(value);
      this.service.addRaceCheckPoint(this.data.raceId, this.data.raceFormatId, model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  onCheckTimeChange($event: Event) {
    console.log($event);
  }

  onCheckDateChange($event: MatDatepickerInputEvent<any, any>) {
    console.log($event);
  }
}
