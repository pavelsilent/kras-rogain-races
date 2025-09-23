import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { lastValueFrom, Subject } from 'rxjs';
import { DictionaryService } from '../../components/dictionaries/dictionary.service';
import { RaceService } from '../../components/race/race.service';
import { CityModel } from '../../models/city.model';
import { RaceSetupModel } from '../../models/race-setup.model';
import { RaceTypeModel } from '../../models/race-type.model';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { parseLocalDate } from '../../utils/utils';
import { AddCityDialogComponent } from '../add-city-dialog/add-city-dialog.component';
import { AddRaceTypeDialogComponent } from '../add-race-type-dialog/add-race-type-dialog.component';

@Component({
             selector: 'app-add-race-dialog',
             imports: [
               MatFormField,
               MatSelect,
               MatOption,
               NgForOf,
               ReactiveFormsModule,
               MatDialogContent,
               MatDialogTitle,
               MatInput,
               MatDatepickerInput,
               MatDatepickerToggle,
               MatDatepickerModule,
               MatDatepicker,
               MatDialogActions,
               MatButton,
               MatLabel,
               MatMomentDateModule,
               MatIconModule,
               MatPrefix,
               MatSuffix,
             ],
             templateUrl: './add-race-dialog.component.html',
             standalone: true,
             styleUrl: './add-race-dialog.component.css',
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },

             ],
           })
export class AddRaceDialogComponent {
  raceTypes: RaceTypeModel[];
  raceTypesRefresh$: Subject<void> = new Subject<void>();
  citiesRefresh$: Subject<void> = new Subject<void>();
  cities: CityModel[];
  raceTypeControl = new FormControl(undefined, Validators.required);
  cityControl = new FormControl(undefined, Validators.required);

  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddRaceDialogComponent>);
  form = this.fb.group({
                         name: new FormControl('', Validators.required),
                         description: new FormControl(''),
                         raceType: this.raceTypeControl,
                         raceDate: [undefined, Validators.required],
                         city: this.cityControl,
                       });

  constructor(private service: RaceService, private dictionaryService: DictionaryService, private dialog: MatDialog) {
    this.raceTypesRefresh$.subscribe(
      data => dictionaryService.getRaceTypes()
                               .subscribe(value => this.raceTypes = value));
    this.raceTypesRefresh$.next();

    this.citiesRefresh$.subscribe(
      data => dictionaryService.getCities()
                               .subscribe(value => this.cities = value));
    this.citiesRefresh$.next();
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;

      const model = new RaceSetupModel();
      model.name = formValue.name!;
      model.description = formValue.description!;
      model.date = parseLocalDate(formValue.raceDate!);
      model.typeId = formValue.raceType!;
      model.cityId = formValue.city!;

      this.service.createRace(model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  protected readonly onselect = onselect;

  onSelectRaceType(raceTypeId: any) {
    if (raceTypeId === '-1') {
      this.raceTypeControl.reset();
      const dialogRef =
        this.dialog.open(AddRaceTypeDialogComponent, {
          width: '500px',
        });

      lastValueFrom(dialogRef.afterClosed())
        .then(value => {
          this.raceTypeControl.setValue(value);
          this.raceTypesRefresh$.next();
        });

    }
  }

  onSelectCity(cityId: any) {
    if (cityId === '-1') {
      this.cityControl.reset();
      const dialogRef =
        this.dialog.open(AddCityDialogComponent, {
          width: '500px',
        });

      lastValueFrom(dialogRef.afterClosed())
        .then(value => {
          this.cityControl.setValue(value);
          this.citiesRefresh$.next();
        });

    }
  }
}
