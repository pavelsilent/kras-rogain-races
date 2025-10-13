import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { firstValueFrom, lastValueFrom, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { RaceService } from '../../components/race/race.service';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { AthleteModel } from '../../models/athlete.model';
import { RaceAthleteSetupModel } from '../../models/race-athlete-setup.model';
import { RaceFormatModel } from '../../models/race-format.model';
import { exists } from '../../utils/utils';
import { SelectAthleteDialog } from '../select-athlete-dialog/select-athlete-dialog';
import { SelectAthleteGroupDialog } from '../select-athlete-group-dialog/select-athlete-group-dialog';

export interface AddRaceAthleteDialogConfig {
  raceId: number;
  formatId: number,
}

@Component({
             selector: 'app-add-race-athlete-dialog',
             imports: [
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
               MatSuffix,
               NgForOf,
               ReactiveFormsModule,
               AsyncPipe,
               MatIconButton,
               MatIcon,
             ],
             templateUrl: './add-race-athlete-dialog.component.html',
             standalone: true,
             styleUrl: './add-race-athlete-dialog.component.css',
           })
export class AddRaceAthleteDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddRaceAthleteDialogComponent>);
  format$: Observable<RaceFormatModel>;
  athleteGroups$: Observable<AthleteGroupModel[]>;
  raceAthletesIds$: Observable<number[]>;
  raceAthletesRefresh$: Subject<void> = new Subject();
  athleteGroupsRefresh$: Subject<void> = new Subject();

  athleteControl = new FormControl(undefined, Validators.required);
  athleteGroupControl = new FormControl(undefined, Validators.required);

  form = this.fb.group({
                         bibNumber: new FormControl(undefined, Validators.required),
                         athlete: this.athleteControl,
                         athleteGroup: this.athleteGroupControl,
                       });

  constructor(
    private service: RaceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceAthleteDialogConfig,
  ) {
    // @ts-ignore
    this.athleteGroups$ = this.athleteGroupsRefresh$.pipe(
      startWith(null),
      switchMap(value => service.getRaceFormatById(data.raceId, data.formatId, true)),
      map(data => data.athleteGroups),
    );

    this.raceAthletesIds$ = this.raceAthletesRefresh$.pipe(
      startWith(null),
      switchMap(value => service.getRaceFormatsAthletes(data.raceId, data.formatId)),
      map(value => value.map(value => value.athlete)
                        .map(value => value.id!)),
    );
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;
      const model = new RaceAthleteSetupModel();
      model.bibNumber = formValue.bibNumber!;
      model.athlete = formValue.athlete!;
      model.athleteGroupId = formValue.athleteGroup!;
      this.service.addRaceAthlete(this.data.raceId, this.data.formatId, model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  openAthleteDialog() {
    firstValueFrom(this.raceAthletesIds$)
      .then(ids =>
              this.dialog.open(
                SelectAthleteDialog, {
                  width: '900px',
                  height: '850px',
                  maxWidth: '90vw',
                  disableClose: true,
                  data: { selectedAthleteIds: ids },
                }))
      .then(value => lastValueFrom(value.afterClosed()))
      .then(value => {
        this.athleteControl.setValue(value);
      });
  };

  onSelectAthleteGroup(athleteGroupId: any) {
    if (athleteGroupId === '-1') {
      this.athleteGroupControl.reset();

      firstValueFrom(this.athleteGroups$)
        .then(value => value.map(value => value.id))
        .then(raceForamtAthleteGroupIds => this.dialog.open(SelectAthleteGroupDialog, {
          width: '500px',
          disableClose: true,
          data: {
            raceId: this.data.raceId,
            formatId: this.data.formatId,
            selectedIds: raceForamtAthleteGroupIds,
          },
        }))
        .then(dialogRef => lastValueFrom(dialogRef.afterClosed()))
        .then(value => {
          this.athleteGroupControl.setValue(value);
          this.athleteGroupsRefresh$.next();
        });
    }
  }

  getAthleteFIO() {
    if (exists(this.athleteControl.value)) {
      let athlete = this.athleteControl.value as any as AthleteModel;
      return athlete.getFIO();
    }

    return '';
  }
}
