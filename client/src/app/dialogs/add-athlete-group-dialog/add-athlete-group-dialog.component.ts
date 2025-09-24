import { NgForOf, NgSwitchCase } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { AthletesService } from '../../components/athlete-list/athletes.service';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { AthleteGroupSex } from '../../models/enums/athlete-group-sex.enum';
import { resolveEnumOrDefault } from '../../utils/utils';

@Component({
             selector: 'app-add-athlete-group-dialog',
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
               NgForOf,
               ReactiveFormsModule,
               NgSwitchCase,
             ],
             templateUrl: './add-athlete-group-dialog.component.html',
             standalone: true,
             styleUrl: './add-athlete-group-dialog.component.css',
           })
export class AddAthleteGroupDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddAthleteGroupDialogComponent>);
  form = this.fb.group({
                         name: ['', Validators.required],
                         description: [''],
                         sex: [undefined, Validators.required],
                       });
  sexes: AthleteGroupSex[] = AthleteGroupSex.store.values();

  constructor(private service: AthletesService) {
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;

      const model = new AthleteGroupModel();
      model.name = formValue.name!;
      model.description = formValue.description!;
      model.sex = resolveEnumOrDefault(formValue.sex!, AthleteGroupSex.store, undefined);
      this.service.createAthleteGroup(model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
