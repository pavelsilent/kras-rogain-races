import { NgForOf } from '@angular/common';
import { Component, signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Router, RouterOutlet } from '@angular/router';

@Component({
             selector: 'app-root',
             imports: [RouterOutlet, MatTab, MatTabGroup, NgForOf],
             templateUrl: './app.component.html',
             standalone: true,
             styleUrl: './app.component.css',
           })
export class AppComponent {
  protected readonly title = signal('krsk-rogain-results-front');

  tabs = [
    { label: 'Races', route: '/races' },
    { label: 'Athletes', route: '/athletes' }
  ];

  constructor(private router: Router) {}

  onTabChange(index: number) {
    this.router.navigate([this.tabs[index].route]);
  }

}
