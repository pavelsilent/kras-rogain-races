import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
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
import { AthleteListComponent } from '../../components/athlete-list/athlete-list.component';
import { AthletesService } from '../../components/athlete-list/athletes.service';
import { RaceService } from '../../components/race/race.service';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { hasLength } from '../../utils/utils';
import { AddAthleteGroupDialogComponent } from '../add-athlete-group-dialog/add-athlete-group-dialog.component';

export interface SelectAthleteGroupDialogConfig {
  raceId: number,
  formatId: number,
  selectedIds: number[];
}

@Component({
             selector: 'app-select-athlete-group-dialog',
             imports: [
               AthleteListComponent,
               MatButton,
               MatDialogActions,
               AsyncPipe,
               MatDialogContent,
               MatDialogTitle,
               MatFormField,
               MatIcon,
               MatIconButton,
               MatInput,
               MatLabel,
               MatOption,
               MatSelect,
               MatSuffix,
               NgForOf,
               ReactiveFormsModule,
             ],
             templateUrl: './select-athlete-group-dialog.html',
             standalone: true,
             styleUrl: './select-athlete-group-dialog.css',
           })
export class SelectAthleteGroupDialog {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<SelectAthleteGroupDialog>);
  athleteGroups$: Observable<AthleteGroupModel[]>;
  refresh$: Subject<void> = new Subject();

  athleteGroupsControl = new FormControl([], Validators.required);
  form = this.fb.group({ athleteGroups: this.athleteGroupsControl });

  constructor(
    private raceService: RaceService,
    athleteService: AthletesService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: SelectAthleteGroupDialogConfig,
  ) {
    // @ts-ignore
    this.athleteGroups$ = this.refresh$.pipe(
      startWith(null),
      switchMap(value => athleteService.getAthleteGroups()),
      map(groups =>
            groups?.filter(group => !hasLength(this.data.selectedIds) ||
              !this.data.selectedIds.includes(group.id))),
    );
  }

  submit() {
    if (this.form.valid) {
      firstValueFrom(this.athleteGroups$)
        .then(
          athleteGroups => {
            let athleteGroupsIds = this.form.value.athleteGroups as number[];
            return athleteGroups.filter(group => athleteGroupsIds?.includes(group.id));
          })
        .then(value => this.raceService.addRaceAthleteGroups(
          this.data.raceId,
          this.data.formatId,
          value,
        ))
        .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  onSelectAthleteGroups(athleteGroupIds: any) {
    if (athleteGroupIds.find((id: string) => id === '-1')) {
      const dialogRef =
        this.dialog.open(AddAthleteGroupDialogComponent, {
          width: '500px',
          disableClose: true,
        });

      lastValueFrom(dialogRef.afterClosed())
        .then(value => {
          let ids = this.athleteGroupsControl.value?.filter(value => value !== '-1') as number[];
          ids.push(value);
          // @ts-ignore
          this.athleteGroupsControl.setValue(ids);
          this.refresh$.next();
        });
    }
  }
}
