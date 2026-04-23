import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AppService } from '../app.service';

@Injectable({
              providedIn: 'root',
            })
export class DisableEditGuard
  implements CanActivate {
  constructor(private appService: AppService, private router: Router) {

  }

  canActivate() {
    return lastValueFrom(this.appService.canSetup())
      .then(value => {
        if (!value) {
          this.router.navigate(['/']);
        }
        return value;
      });
  }
}
