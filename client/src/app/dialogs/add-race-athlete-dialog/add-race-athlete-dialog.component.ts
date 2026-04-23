import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Option } from 'funfix-core';
import { firstValueFrom, lastValueFrom, map, Observable, startWith, Subject, switchMap } from 'rxjs';
import { RaceService } from '../../components/race/race.service';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { AthleteType } from '../../models/enums/athlete-type.enum';
import { MemberInfoModel } from '../../models/member-info.model';
import { RaceMemberSetupModel } from '../../models/race-member-setup.model';
import { RaceMemberModel } from '../../models/race-member.model';
import { exists, hasLength } from '../../utils/utils';
import { SelectAthleteDialog } from '../select-athlete-dialog/select-athlete-dialog';
import { SelectAthleteGroupDialog } from '../select-athlete-group-dialog/select-athlete-group-dialog';
import { SelectAthleteTeamDialogComponent } from '../select-athlete-team-dialog/select-athlete-team-dialog.component';

export interface AddRaceAthleteDialogConfig {
  raceId: number;
  formatId: number,
  athleteType: AthleteType,
  raceMember?: RaceMemberModel
}

@Component({
             selector: 'app-add-race-athlete-dialog',
             imports: [
               MatButton,
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
  athleteGroups$: Observable<AthleteGroupModel[]>;
  raceAthletesIds$: Observable<number[]>;
  raceAthletesRefresh$: Subject<void> = new Subject();
  athleteGroupsRefresh$: Subject<void> = new Subject();
  athleteControl: FormControl;
  athleteGroupControl: FormControl;
  form: FormGroup;
  title: string;
  memberLabel: string;

  constructor(
    private service: RaceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceAthleteDialogConfig,
  ) {
    this.title = (exists(data.raceMember) ? 'Редактировать' : 'Добавить') + (data.athleteType === AthleteType.ATHLETE ? ' атлета' : ' команду');
    this.memberLabel =  (data.athleteType === AthleteType.ATHLETE ? 'Атлет' : 'Команда');
    this.athleteControl = new FormControl(
      exists(data.raceMember) ? data.raceMember.member : undefined,
      Validators.required,
    );
    this.athleteControl.setValue(exists(data.raceMember) ? data.raceMember.member : undefined);
    this.athleteGroupControl = new FormControl(exists(data.raceMember)
                                               ? Option.of(data.raceMember.groups.map(value => value.id))
                                                       .filter(data => hasLength(data))
                                                       .map(data => data[0])
                                                       .getOrElse(undefined)
                                               : undefined, Validators.required);

    this.form = this.fb.group({
                                bibNumber: new FormControl(exists(data.raceMember)
                                                           ? data.raceMember.bibNumber
                                                           : undefined, Validators.required),
                                athlete: this.athleteControl,
                                athleteGroup: this.athleteGroupControl,
                              });
    // @ts-ignore
    this.athleteGroups$ = this.athleteGroupsRefresh$.pipe(
      startWith(null),
      switchMap(value => service.getRaceFormatById(data.raceId, data.formatId, true)),
      map(data => data.athleteGroups),
    );

    this.raceAthletesIds$ = this.raceAthletesRefresh$.pipe(
      startWith(null),
      switchMap(value => service.getRaceFormatsAthletes(data.raceId, data.formatId)),
      map(value => value.map(value => value.member)
                        .map(value => value.id!)),
    );
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;
      const model = new RaceMemberSetupModel();
      model.bibNumber = formValue.bibNumber!;
      model.memberId = formValue.athlete!.id!;
      model.memberType = this.data.athleteType;
      model.athleteGroupId = formValue.athleteGroup!;

      if (exists(this.data.raceMember)) {
        model.id = this.data.raceMember.id;
        this.service.editRaceAthlete(this.data.raceId, this.data.formatId, model)
            .then(value => this.dialogRef.close(value));
      } else {
        this.service.addRaceAthlete(this.data.raceId, this.data.formatId, model)
            .then(value => this.dialogRef.close(value));
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  openAthleteDialog() {
    if (this.data.athleteType === AthleteType.ATHLETE) {
      this.openSelectAthleteDialog();
    } else if (this.data.athleteType === AthleteType.ATHLETE_TEAM) {
      this.openSelectAthleteTeamDialog();
    }
  }

  openSelectAthleteDialog() {
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
        this.athleteControl.setValue(Option.of(value).map(data => data.toMemberInfo()).getOrElse(null));
      });
  };

  openSelectAthleteTeamDialog() {
    firstValueFrom(this.raceAthletesIds$)
      .then(ids =>
              this.dialog.open(
                SelectAthleteTeamDialogComponent, {
                  width: '900px',
                  height: '850px',
                  maxWidth: '90vw',
                  disableClose: true,
                  data: { selectedTeamIds: ids },
                }))
      .then(value => lastValueFrom(value.afterClosed()))
      .then(value => {
        this.athleteControl.setValue(Option.of(value).map(data => data.toMemberInfo()).getOrElse(null));
      });
  };

  onSelectAthleteGroup(athleteGroupId: any) {
    if (athleteGroupId === '-1') {
      this.athleteGroupControl.reset();

      firstValueFrom(this.athleteGroups$)
        .then(value => value.map(value => value.id))
        .then(raceFormatAthleteGroupIds => this.dialog.open(SelectAthleteGroupDialog, {
          width: '500px',
          disableClose: true,
          data: {
            raceId: this.data.raceId,
            formatId: this.data.formatId,
            selectedIds: raceFormatAthleteGroupIds,
          },
        }))
        .then(dialogRef => lastValueFrom(dialogRef.afterClosed()))
        .then(value => {
          this.athleteGroupControl.setValue(value);
          this.athleteGroupsRefresh$.next();
        });
    }
  }

  getAthleteName() {
    if (exists(this.athleteControl.value)) {
      let athlete = this.athleteControl.value as any as MemberInfoModel;
      return athlete.name;
    }

    return '';
  }
}
