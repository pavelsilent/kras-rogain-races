import { Injectable } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AppSettingsControllerService } from './api/index';

@Injectable({
              providedIn: 'root',
            })
export class AppService {

  constructor(private settingService: AppSettingsControllerService) {
    this.canSetup$ = settingService.getSettings().pipe(map(setting => setting.setupEnabled!));
    this.canEdit$ = settingService.getSettings().pipe(map(setting => setting.editEnabled!));
  }

  private canSetup$: Observable<boolean>;
  private canEdit$: Observable<boolean>;
  private isMobile$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  canEdit() {
    return this.canEdit$.pipe();
  }

  canSetup() {
    return this.canSetup$.pipe();
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
