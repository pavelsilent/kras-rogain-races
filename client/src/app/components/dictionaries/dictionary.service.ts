import { Injectable } from '@angular/core';
import { lastValueFrom, map, Observable } from 'rxjs';
import { DictionaryControllerService } from '../../api/index';
import { CityModel } from '../../models/city.model';
import { RaceTypeModel } from '../../models/race-type.model';

@Injectable({
              providedIn: 'root',
            })
export class DictionaryService {

  constructor(public backend: DictionaryControllerService) {
  }

  getRaceTypes(): Observable<RaceTypeModel[]> {
    return this.backend.getAllRaceTypes().pipe(
      map(items => items.map(item => RaceTypeModel.fromDTO(item))),
    );
  }

  createRaceType(data: RaceTypeModel): Promise<number> {
    return lastValueFrom(this.backend.createRaceType(data.toDTO()));
  }

  getCities(): Observable<CityModel[]> {
    return this.backend.getAllCities().pipe(
      map(items => items.map(item => CityModel.fromDTO(item))),
    );
  }

  createCity(data: CityModel): Promise<number> {
    return lastValueFrom(this.backend.createCity(data.toDTO()));
  }

}
