import { Injectable, signal } from '@angular/core';

export interface ErrorDialogData {
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ErrorDialogService {
  public error = signal<ErrorDialogData | null>(null);

  show(title: string, message: string) {
    this.error.set({ title, message });
  }

  hide() {
    this.error.set(null);
  }
}
