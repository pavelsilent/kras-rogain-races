import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Option } from 'funfix-core';
import { lastValueFrom, Observable, startWith, Subject, switchMap } from 'rxjs';
import { AthletesService } from '../../components/athlete-list/athletes.service';
import { DictionaryService } from '../../components/dictionaries/dictionary.service';
import { AthleteModel } from '../../models/athlete.model';
import { CityModel } from '../../models/city.model';
import { Sex } from '../../models/enums/sex.enum';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { parseLocalDate, resolveEnumOrDefault } from '../../utils/utils';
import { AddCityDialogComponent } from '../add-city-dialog/add-city-dialog.component';

@Component({
             selector: 'app-add-athlete-dialog',
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
               MatDatepicker,
               MatDialogActions,
               MatButton,
               MatLabel,
               MatMomentDateModule,
               MatIconModule,
               MatPrefix,
               MatSuffix,
               AsyncPipe,
               NgIf,
             ],
             templateUrl: './add-athlete-dialog.component.html',
             standalone: true,
             styleUrl: './add-athlete-dialog.component.css',
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
           })
export class AddAthleteDialogComponent {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<AddAthleteDialogComponent>);
  sexes: Sex[] = Sex.store.values();
  citiesRefresh$: Subject<void> = new Subject<void>();
  cities$: Observable<CityModel[]>;
  cityControl = new FormControl(undefined, Validators.required);

  form = this.fb.group({
                         lastName: ['', Validators.required],
                         firstName: ['', Validators.required],
                         middleName: ['', Validators.required],
                         birthDate: [undefined, Validators.required],
                         sex: [undefined, Validators.required],
                         city: this.cityControl,
                         club: [''],
                       });

  constructor(
    private service: AthletesService,
    private dictionaryService: DictionaryService,
    private dialog: MatDialog,
  ) {
    this.cities$ = this.citiesRefresh$.pipe(
      startWith(null),
      switchMap(data => dictionaryService.getCities()),
    );
  }

  onSelectCity(cityId: any) {
    if (cityId === '-1') {
      this.cityControl.reset();
      const dialogRef =
        this.dialog.open(AddCityDialogComponent, {
          width: '500px',
          disableClose: true,
        });

      lastValueFrom(dialogRef.afterClosed())
        .then(value => {
          this.cityControl.setValue(value);
          this.citiesRefresh$.next();
        });
    }
  }

  submit() {
    if (this.form.valid) {
      let formValue = this.form.value;

      const model = new AthleteModel();
      model.firstName = formValue.firstName!;
      model.lastName = formValue.lastName!;
      model.middleName = formValue.middleName || undefined;
      model.sex = resolveEnumOrDefault(formValue.sex!, Sex.store, undefined);
      model.birthDate = parseLocalDate(formValue.birthDate!);
      model.club = formValue.club || undefined;
      model.city = Option.of(formValue.city).map(id => CityModel.of(id!)).getOrElse(undefined);

      this.service.createAthlete(model)
          .then(value => this.dialogRef.close(value));
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
