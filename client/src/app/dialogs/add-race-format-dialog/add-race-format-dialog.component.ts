import { NgForOf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
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
import { lastValueFrom, startWith, Subject } from 'rxjs';
import { AthletesService } from '../../components/athlete-list/athletes.service';
import { AttachFieldComponent } from '../../components/core/attach-field/attach-field.component';
import { RaceService } from '../../components/race/race.service';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { RaceFormatType } from '../../models/enums/race-format-type.enum';
import { RaceFormatModel } from '../../models/race-format.model';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { exists, hasLength, parseLocalDateTimeFromMoment, resolveEnum } from '../../utils/utils';
import { AddAthleteGroupDialogComponent } from '../add-athlete-group-dialog/add-athlete-group-dialog.component';

export interface AddRaceFormatDialogConfig {
  raceId: number;
}

@Component({
             selector: 'app-add-race-format-dialog',
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
               AttachFieldComponent,
             ],
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
             templateUrl: './add-race-format-dialog.component.html',
             standalone: true,
             styleUrl: './add-race-format-dialog.component.css',
           })
export class AddRaceFormatDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddRaceFormatDialogComponent>);

  athleteGroups: AthleteGroupModel[];
  athleteGroupsRefresh$: Subject<void> = new Subject<void>();
  athleteGroupsControl = new FormControl([], Validators.required);

  types: RaceFormatType[] = RaceFormatType.store.values();

  form = this.fb.group({
                         name: new FormControl('', Validators.required),
                         description: new FormControl(''),
                         type: new FormControl('', Validators.required),
                         startDate: [undefined, Validators.required],
                         startTime: ['', Validators.required],
                         finishDate: [undefined, Validators.required],
                         finishTime: ['', Validators.required],
                         athleteGroups: this.athleteGroupsControl,
                         img: [],
                       });

  constructor(
    private service: RaceService,
    athletesService: AthletesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceFormatDialogConfig,
  ) {
    this.athleteGroupsRefresh$.pipe(startWith(null))
        .subscribe(data => athletesService.getAthleteGroups()
                                          .subscribe(value => this.athleteGroups = value));
  }

  submit() {
    console.log( this.form.value);
    if (this.form.valid) {
      let value = this.form.value;

      const model = new RaceFormatModel();
      model.name = value.name!;
      model.description = value.description!;
      model.type = resolveEnum(value.type!, RaceFormatType.store);
      model.startDateTime = parseLocalDateTimeFromMoment(value.startDate!, value.startTime!);
      model.finishDateTime = parseLocalDateTimeFromMoment(value.finishDate!, value.finishTime!);
      model.athleteGroups = this.getAthleteGroups(hasLength(value.athleteGroups)
                                                  ? value.athleteGroups as any as number[]
                                                  : []);
      console.log(model);
      this.service.createRaceFormat(this.data.raceId, model)
          .then(value => this.dialogRef.close(value));
    }
  }

  getAthleteGroups(groupsIds: number[]): AthleteGroupModel[] {
    if (!hasLength(groupsIds)) {
      return [];
    }
    return groupsIds.map(groupId => this.athleteGroups.find(group => group.id === groupId))
                    .filter(value => exists(value));
  }

  cancel() {
    this.dialogRef.close();
  }

  protected readonly onselect = onselect;

  onSelectAthleteGroups(athleteGroupIds: any) {
    if (athleteGroupIds.find((id: string) => id === '-1')) {
      // this.raceTypeControl.reset();
      const dialogRef =
        this.dialog.open(AddAthleteGroupDialogComponent, {
          width: '500px',
        });

      lastValueFrom(dialogRef.afterClosed())
        .then(value => {
          // @ts-ignore

          let ids = this.athleteGroupsControl.value.filter(value => value !== '-1') as number[];
          ids.push(value);
          // @ts-ignore
          this.athleteGroupsControl.setValue(ids);
          this.athleteGroupsRefresh$.next();
        });

    }
  }

}
