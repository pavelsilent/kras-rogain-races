import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Option } from 'funfix-core';
import { DictionaryService } from '../../components/dictionaries/dictionary.service';
import { RaceTypeModel } from '../../models/race-type.model';

@Component({
             selector: 'app-add-race-type-dialog',
             imports: [
               MatFormFieldModule, MatInputModule,
               RouterLink, MatButton, FormsModule,
               MatDialogActions, MatDialogContent, MatDialogTitle, NgForOf, ReactiveFormsModule,
             ],
             templateUrl: './add-race-type-dialog.component.html',
             standalone: true,
             styleUrl: './add-race-type-dialog.component.css',
           })
export class AddRaceTypeDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddRaceTypeDialogComponent>);
  form = this.fb.group({
                         name: ['', Validators.required],
                         description: [''],
                       });

  constructor(private service: DictionaryService) {
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;

      const model = new RaceTypeModel();
      model.name = formValue.name!;
      model.description = Option.of(formValue.description).getOrElse(null)!;
      this.service.createRaceType(model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
