import { Routes } from '@angular/router';
import { AthleteListComponent } from './components/athlete-list/athlete-list.component';
import { AthleteComponent } from './components/athlete/athlete.component';
import { NotFoundComponent } from './components/core/not-found/not-found.component';
import {
  RaceFormatAthletesTabComponent,
} from './components/race-format-page/athletes-tab/race-format-athletes-tab.component';
import {
  RaceFormatCheckPointsTabComponent,
} from './components/race-format-page/check-points-tab/race-format-check-points-tab.component';
import { RaceFormatMainTabComponent } from './components/race-format-page/main-tab/race-format-main-tab.component';
import { RaceFormatPageComponent } from './components/race-format-page/race-format-page.component';
import { RaceFormatResultComponent } from './components/race-format-page/result-tab/race-format-result.component';
import { RaceListComponent } from './components/race-list/race-list.component';
import { RaceResultPageComponent } from './components/race-result-page/race-result-page.component';
import { RaceComponent } from './components/race/race.component';

export const routes: Routes = [
  { path: '', component: NotFoundComponent },
  { path: 'races', component: RaceListComponent },
  { path: 'races/:id', component: RaceComponent },
  {
    path: 'races/:id/formats/:formatId',
    component: RaceFormatPageComponent,
    children: [
      { path: 'main', component: RaceFormatMainTabComponent },
      { path: 'checkpoints', component: RaceFormatCheckPointsTabComponent },
      { path: 'athletes', component: RaceFormatAthletesTabComponent },
      { path: 'result', component: RaceFormatResultComponent },
      { path: '', redirectTo: 'main', pathMatch: 'full' },
    ],
  },
  { path: 'athletes', component: AthleteListComponent },
  { path: 'athletes/:id', component: AthleteComponent },
  { path: 'results/:token', component: RaceResultPageComponent },
  { path: '**', component: NotFoundComponent },

];
