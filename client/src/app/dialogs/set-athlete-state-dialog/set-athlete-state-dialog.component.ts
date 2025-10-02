import { NgForOf } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { RaceService } from '../../components/race/race.service';
import { AthleteState } from '../../models/enums/athlete-state.enum';
import { exists } from '../../utils/utils';

export interface SetAthleteStateDialogConfig {
  raceId: number;
  raceFormatId: number;
  athleteBibNumber?: number;
}

@Component({
             selector: 'app-set-athlete-state-dialog.component',
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
             templateUrl: './set-athlete-state-dialog.component.html',
             standalone: true,
             styleUrl: './set-athlete-state-dialog.component.css',
           })
export class SetAthleteStateDialogComponent {
  states: AthleteState[] = AthleteState.store.values();
  form: FormGroup;
  stateControl: FormControl;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SetAthleteStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SetAthleteStateDialogConfig,
    private service: RaceService,
  ) {
    this.stateControl = new FormControl(AthleteState.NOT_DATA.code, Validators.required);
    this.form = this.fb.group({
                                athleteBibNumber: [data.athleteBibNumber, Validators.required],
                                state: this.stateControl,
                              });
    if (exists(data.athleteBibNumber)) {
      service.getRaceAthleteState(data.raceId, data.raceFormatId, data.athleteBibNumber)
             .then(value => this.stateControl.setValue(value.code));
    }
  }

  onSelectState(state: any) {
    this.stateControl.setValue(state);
  }

  onSave(): void {
    if (this.form.valid) {
      let value = this.form.value;
      this.service.setRaceAthleteState(this.data.raceId, this.data.raceFormatId, value.athleteBibNumber, value.state)
          .then(value => this.dialogRef.close(value));
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
