import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, HostListener, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { AppService } from './app.service';
import { ErrorDialogComponent } from './components/core/error-dialog/error-dialog.component';
import { LoaderComponent } from './components/core/loader/loader.component';
import { LoaderService } from './components/core/loader/loader.service';

@Component({
             selector: 'app-root',
             imports: [
               RouterOutlet, MatTab, MatTabGroup, NgForOf, NgIf, AsyncPipe, LoaderComponent,
               ErrorDialogComponent, MatSlideToggle, FormsModule,
             ],
             templateUrl: './app.component.html',
             standalone: true,
             styleUrl: './app.component.css',
           })
export class AppComponent
  implements OnInit {
  protected readonly title = signal('krsk-rogain-results-front');

  constructor(private router: Router, public appService: AppService, loader: LoaderService,
              private breakpointObserver: BreakpointObserver,
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        loader.show();
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        loader.hide();
      }
    });

  }

  ngOnInit() {
    this.breakpointObserver.observe([Breakpoints.Handset])
        .subscribe(result => {
          this.appService.setIsMobile(result.matches);
        });
    this.onResize();
  }

  get toggleScale(): number {
    const minScale = 0.6;
    const maxScale = 1;
    const scale = window.innerWidth / 1200; // 1200px — базовая ширина баннера
    return Math.max(minScale, Math.min(scale, maxScale));
  }

  @HostListener('window:resize')
  onResize() {
    document.documentElement.style.setProperty('--toggle-scale', this.toggleScale.toString());
  }

  onBannerClick() {
    this.router.navigate(['/']);
  }
}
