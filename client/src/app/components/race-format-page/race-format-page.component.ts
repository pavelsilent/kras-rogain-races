import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AppService } from '../../app.service';
import { RaceFormatPageService } from './race-format-page.service';

@Component({
             selector: 'app-race-format-page',
             imports: [
               RouterOutlet,
               MatTab,
               MatTabGroup,
               NgForOf,
               RouterLink,
             ],
             templateUrl: './race-format-page.component.html',
             standalone: true,
             styleUrl: './race-format-page.component.css',
             providers: [RaceFormatPageService],
           })
export class RaceFormatPageComponent {
  tabs = [
    { label: 'Основное', route: 'main' },
    { label: 'Контрольные пункты', route: 'checkpoints' },
    { label: 'Стартовый лист', route: 'athletes' },
    { label: 'Результаты', route: 'result' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private page: RaceFormatPageService,
    private appService: AppService,
  ) {
    let raceId = Number(this.route.snapshot.paramMap.get('id'));
    let formatId = Number(this.route.snapshot.paramMap.get('formatId'));
    this.page.setData(raceId, formatId, true);
    this.page.setCanEditByToken(true);
  }

  onTabChange(index: number) {
    this.page.getData()
        .pipe()
        .subscribe(([raceId, raceFormatId]) => {
          const tab = this.tabs[index];
          this.router.navigate(['/races', raceId, 'formats', raceFormatId, tab.route]);
        });
  }
}
