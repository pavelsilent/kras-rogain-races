export * from './athleteController.service';
import { AthleteControllerService } from './athleteController.service';
export * from './dictionaryController.service';
import { DictionaryControllerService } from './dictionaryController.service';
export * from './raceController.service';
import { RaceControllerService } from './raceController.service';
export const APIS = [AthleteControllerService, DictionaryControllerService, RaceControllerService];
