import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AthleteControllerService } from '../../api/index';
import { AthleteGroupModel } from '../../models/athlete-group.model';
import { AthleteModel } from '../../models/athlete.model';

@Injectable({
              providedIn: 'root',
            })
export class AthletesService {

  constructor(public backend: AthleteControllerService) {
  }

  getAthletes(): Observable<AthleteModel[]> {
    return this.backend.getAllAthletes().pipe(
      map(items => items.map(item => AthleteModel.fromDTO(item))),
    );
  }

  createAthlete(model: AthleteModel): Promise<number> {
    return lastValueFrom(this.backend.createAthlete(model.toDTO()));
  }

  updateAthlete(model: AthleteModel): Promise<AthleteModel> {
    return lastValueFrom(this.backend.updateAthlete(model.toDTO()).pipe(
      map(item => AthleteModel.fromDTO(item))));
  }

  getAthleteById(id: number): Observable<AthleteModel> {
    return this.backend.getAthleteById(id).pipe(
      map(item => AthleteModel.fromDTO(item)),
    );
  }

  getAthleteGroups(): Observable<AthleteGroupModel[]> {
    return this.backend.getAllAthleteGroups().pipe(
      map(items => items.map(item => AthleteGroupModel.fromDTO(item))),
    );
  }

  createAthleteGroup(model: AthleteGroupModel): Promise<number> {
    return lastValueFrom(this.backend.createAthleteGroup(model.toDTO()));
  }

}
