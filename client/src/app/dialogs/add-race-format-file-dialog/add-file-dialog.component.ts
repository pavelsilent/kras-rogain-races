import { NgForOf } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { AttachFieldComponent } from '../../components/core/attach-field/attach-field.component';
import { FileService } from '../../components/core/file.service';

export interface AddRaceFormatFileDialogConfig {
  entityId: number;
  entityType: string;
  fileType: string;
}

@Component({
             selector: 'app-add-race-format-file-dialog',
             imports: [
               MatDialogContent,
               MatDialogTitle,
               ReactiveFormsModule,
               MatFormField,
               MatSelect,
               MatLabel,
               MatOption,
               AttachFieldComponent,
               MatDialogActions,
               MatButton,
               NgForOf,
             ],
             templateUrl: './add-file-dialog.component.html',
             standalone: true,
             styleUrl: './add-file-dialog.component.css',
           })
export class AddFileDialogComponent {

  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddFileDialogComponent>);
  form = this.fb.group({
                         file: new FormControl('', Validators.required),
                       });

  constructor(
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: AddRaceFormatFileDialogConfig,
  ) {
  }

  submit() {
    if (this.form.valid) {
      let value = this.form.value;
      const formData = new FormData();
      formData.append('file', value.file!); // если файл отдельный, иначе используем внутри DTO
      this.fileService.upload(value.file)
          .then(fileId => this.fileService.link({
                                                  fileId: fileId,
                                                  fileType: this.data.fileType,
                                                  entityType: this.data.entityType,
                                                  entityId: this.data.entityId as any,
                                                }))
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
