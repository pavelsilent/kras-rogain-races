import { Injectable } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject } from 'rxjs';

@Injectable({
              providedIn: 'root',
            })
export class AppService {

  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private isMobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setEditAvailable() {
    this.canEdit$.next(true);
  }

  setEditUnavailable() {
    this.canEdit$.next(false);
  }

  canEdit() {
    return this.canEdit$.pipe();
  }

  setIsMobile(isMobile: boolean) {
    this.isMobile$.next(isMobile);
  }

  isMobile() {
    return this.isMobile$.pipe();
  }

  onIsMobileChanged(event: MatSlideToggleChange) {
    this.setIsMobile(event.checked);
  }

}
