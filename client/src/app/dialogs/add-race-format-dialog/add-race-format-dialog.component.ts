import { NgForOf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
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
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { lastValueFrom, startWith, Subject } from 'rxjs';
import { AthletesService } from '../../components/athlete-list/athletes.service';
import { RaceService } from '../../components/race/race.service';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { RaceFormatType } from '../../models/enums/race-format-type.enum';
import { RaceFormatModel } from '../../models/race-format.model';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { exists, hasLength, localDateTimeToMoment, parseLocalDateTimeFromMoment, resolveEnum } from '../../utils/utils';
import { AddAthleteGroupDialogComponent } from '../add-athlete-group-dialog/add-athlete-group-dialog.component';

export interface AddRaceFormatDialogConfig {
  raceId: number;
  raceFormat?: RaceFormatModel;
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
               MatSuffix,

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
  title: string;
  athleteGroups: AthleteGroupModel[];
  athleteGroupsRefresh$: Subject<void> = new Subject<void>();
  types: RaceFormatType[] = RaceFormatType.store.values();

  form: FormGroup;

  athleteGroupsControl: FormControl;

  constructor(
    private service: RaceService,
    athletesService: AthletesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceFormatDialogConfig,
  ) {
    this.title = (exists(data.raceFormat) ? 'Редактировать' : 'Добавить') + ' дистанцию';

    this.athleteGroupsRefresh$.pipe(startWith(null))
        .subscribe(data => athletesService.getAthleteGroups()
                                          .subscribe(value => this.athleteGroups = value));

    this.athleteGroupsControl = new FormControl(
      exists(data.raceFormat) ? data.raceFormat.athleteGroups?.map(value => value.id) : [],
      Validators.required,
    );
    this.form = this.fb.group({
                                name: new FormControl(
                                  exists(data.raceFormat) ? data.raceFormat.name : '',
                                  Validators.required,
                                ),
                                description: new FormControl(exists(data.raceFormat)
                                                             ? data.raceFormat.description
                                                             : ''),
                                type: new FormControl(
                                  exists(data.raceFormat) ? data.raceFormat.type.code : '',
                                  Validators.required,
                                ),
                                startDate: [
                                  exists(data.raceFormat) ? localDateTimeToMoment(data.raceFormat.startDateTime!) : undefined,
                                  Validators.required,
                                ],
                                startTime: [
                                  exists(data.raceFormat) ? data.raceFormat.getStartTime() : '',
                                  Validators.required,
                                ],
                                finishDate: [
                                  exists(data.raceFormat) ? localDateTimeToMoment(data.raceFormat.finishDateTime!) : undefined,
                                  Validators.required,
                                ],
                                finishTime: [
                                  exists(data.raceFormat) ? data.raceFormat.getFinishTime() : '',
                                  Validators.required,
                                ],
                                athleteGroups: this.athleteGroupsControl,
                              });
  }

  submit() {
    if (this.form.valid) {
      let value = this.form.value;

      const model = new RaceFormatModel();
      if (exists(this.data.raceFormat)) {
        model.id = this.data.raceFormat?.id;
      }
      model.name = value.name!;
      model.description = value.description!;
      model.type = resolveEnum(value.type!, RaceFormatType.store);
      model.startDateTime = parseLocalDateTimeFromMoment(value.startDate!, value.startTime!);
      model.finishDateTime = parseLocalDateTimeFromMoment(value.finishDate!, value.finishTime!);
      model.athleteGroups = this.getAthleteGroups(hasLength(value.athleteGroups)
                                                  ? value.athleteGroups as any as number[]
                                                  : []);
      if (exists(this.data.raceFormat)) {
        this.service.editRaceFormat(this.data.raceId, model)
            .then(value => this.dialogRef.close(value));
      } else {
        this.service.createRaceFormat(this.data.raceId, model)
            .then(value => this.dialogRef.close(value));
      }
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
      const dialogRef =
        this.dialog.open(AddAthleteGroupDialogComponent, {
          width: '500px',
          disableClose: true,
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
