import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { ErrorDialogService } from './error-dialog.service';

@Component({
             selector: 'app-error-dialog',
             standalone: true,
             imports: [CommonModule, MatButton],
             templateUrl: './error-dialog.component.html',
             styleUrl: './error-dialog.component.css',
           })
export class ErrorDialogComponent {
  constructor(public service: ErrorDialogService) {
  }
}
