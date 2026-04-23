import { NgForOf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { AthleteTeamsService } from '../../components/athlete-team-list/athlete-teams.service';
import { AthleteTeamModel } from '../../models/athlete-team.model';
import { AthleteGroupSex } from '../../models/enums/athlete-group-sex.enum';
import { exists, resolveEnumOrDefault } from '../../utils/utils';

export interface AddAthleteTeamDialogConfig {
  team?: AthleteTeamModel;
}

@Component({
             selector: 'app-add-athlete-team-dialog',
             imports: [
               FormsModule,
               MatButton,
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
             ],
             templateUrl: './add-athlete-team-dialog.component.html',
             styleUrl: './add-athlete-team-dialog.component.css',
           })
export class AddAthleteTeamDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddAthleteTeamDialogComponent>);
  sexes: AthleteGroupSex[] = AthleteGroupSex.store.values();
  form: FormGroup;
  title: string;

  constructor(
    private service: AthleteTeamsService,
    @Inject(MAT_DIALOG_DATA) public data: AddAthleteTeamDialogConfig,
  ) {
    this.title = (exists(data?.team) ? 'Редактировать' : 'Добавить') + ' команду';
    this.form = this.fb.group({
                                name: [exists(data?.team) ? data.team?.name : '', Validators.required],
                                sex: [exists(data?.team) ? data.team?.sex?.code : undefined, Validators.required],
                              });
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;

      const model = new AthleteTeamModel();
      model.name = formValue.name!;
      model.sex = resolveEnumOrDefault(formValue.sex!, AthleteGroupSex.store, undefined);

      if (exists(this.data?.team)) {
        model.id = this.data.team.id;
        model.members = this.data.team.members;
        this.service.editTeam(model)
            .then(value => this.dialogRef.close(value));
      } else {
        this.service.createTeam(model)
            .then(value => this.dialogRef.close(value));
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
