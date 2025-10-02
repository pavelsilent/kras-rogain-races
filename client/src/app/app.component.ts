import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from './app.service';
import { LoaderComponent } from './components/loader/loader.component';
import { LoaderService } from './components/loader/loader.service';

@Component({
             selector: 'app-root',
             imports: [RouterOutlet, MatTab, MatTabGroup, NgForOf, NgIf, AsyncPipe, LoaderComponent],
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

  constructor(private router: Router, private appService: AppService, loader: LoaderService) {
    this.needShowTabs$ = appService.canEdit();

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        loader.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        loader.hide();
      }
    });

  }

  onTabChange(index: number) {
    this.router.navigate([this.tabs[index].route]);
  }

}
