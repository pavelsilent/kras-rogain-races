import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './app.service';

@Component({
             selector: 'app-root',
             imports: [RouterOutlet, MatTab, MatTabGroup, NgForOf, NgIf, AsyncPipe],
             templateUrl: './app.component.html',
             standalone: true,
             styleUrl: './app.component.css',
           })
export class AppComponent {
  protected readonly title = signal('krsk-rogain-results-front');
  needShowTabs$: Observable<boolean>;

  tabs = [
    { label: 'Соревнования', route: '/races' },
    { label: 'Атлеты', route: '/athletes' },
  ];

  constructor(private router: Router, private appService: AppService) {
    this.needShowTabs$ = appService.canEdit();

  }

  onTabChange(index: number) {
    this.router.navigate([this.tabs[index].route]);
  }

}
