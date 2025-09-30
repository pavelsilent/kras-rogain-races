import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
              providedIn: 'root',
            })
export class AppService {

  private canEdit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setEditAvailable() {
    this.canEdit$.next(true);
  }

  setEditUnavailable() {
    this.canEdit$.next(false);
  }

  canEdit() {
    return this.canEdit$.pipe();
  }

}
