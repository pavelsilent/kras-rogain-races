import { AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Option } from 'funfix-core';
import { Moment } from 'moment';
import { ReplaySubject, Subject } from 'rxjs';
import { AthleteModel } from '../../models/athlete.model';
import { CityModel } from '../../models/city.model';
import { AthleteField } from '../../models/enums/athlete-field.enum';
import { Sex } from '../../models/enums/sex.enum';
import { EnumPipe } from '../../utils/enum.pipe';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { RussianDatePipe } from '../../utils/russian-date.pipe';
import { exists, localDateToMoment, parseLocalDate, resolveEnum } from '../../utils/utils';
import { AthletesService } from '../athlete-list/athletes.service';

@Component({
             selector: 'app-athlete.component',
             imports: [
               NgSwitch,
               MatInput,
               MatButton,
               MatIconButton,
               ReactiveFormsModule,
               MatDatepickerInput,
               MatDatepicker,
               MatSelect,
               MatOption,
               NgSwitchCase,
               NgForOf,
               NgSwitchDefault,
               MatIcon,
               MatMomentDateModule,
               AsyncPipe,
               MatFormField,
               EnumPipe,
               NgIf,
               RussianDatePipe,
             ],
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
             templateUrl: './athlete.component.html',
             standalone: true,
             styleUrl: './athlete.component.css',
           })
export class AthleteComponent
  implements OnInit {
  athleteId!: number;
  athlete$: Subject<AthleteModel> = new ReplaySubject<AthleteModel>(1);

  sexes: Sex[] = Sex.store.values();
  editField: AthleteField | null = null;
  firstNameControl = new FormControl('', Validators.required);
  lastNameControl = new FormControl('', Validators.required);
  middleNameControl = new FormControl('');
  birthDateControl = new FormControl(undefined as any as Moment, Validators.required);
  sexControl = new FormControl('', Validators.required);
  cityControl = new FormControl(undefined, Validators.required);
  clubControl = new FormControl('', Validators.required);

  form = new FormGroup({
                         lastName: this.lastNameControl,
                         firstName: this.firstNameControl,
                         middleName: this.middleNameControl,
                         birthDate: this.birthDateControl,
                         sex: this.sexControl,
                         city: this.cityControl,
                         club: this.clubControl,
                       });

  constructor(private route: ActivatedRoute, private service: AthletesService) {
  }

  ngOnInit() {
    this.athleteId = Number(this.route.snapshot.paramMap.get('id'));
    this.service.getAthleteById(this.athleteId).pipe()
        .subscribe(value => this.athlete$.next(value));

    this.athlete$.subscribe(data => {
      this.firstNameControl.setValue(data.firstName!);
      this.lastNameControl.setValue(data.lastName!);
      this.middleNameControl.setValue(data.middleName!);
      this.birthDateControl.setValue(Option.of(data.birthDate)
                                           .map(data => localDateToMoment(data))
                                           .getOrElse(null));

      this.sexControl.setValue(data.sex!.code!);
      // @ts-ignore
      this.cityControl.setValue(data.city?.id!);
      this.clubControl.setValue(data.club!);
    });
  }

  startEdit(field: AthleteField) {
    this.editField = field;
  }

  saveEdit(field: AthleteField) {
    if (this.form.get(field.code)?.valid) {
      if (this.form.valid) {
        this.editField = null;
        this.service.updateAthlete(this.buildModel())
            .then(value => this.athlete$.next(value));
      }
    }
  }

  buildModel() {
    let formValue = this.form.value;
    const model = new AthleteModel();
    model.id = this.athleteId;
    model.firstName = formValue.firstName!;
    model.lastName = formValue.lastName!;
    model.middleName = formValue.middleName || undefined;
    // @ts-ignore
    model.sex = resolveEnum(formValue.sex, Sex.store);
    model.birthDate = parseLocalDate(formValue.birthDate!);
    model.club = formValue.club || undefined;
    model.city = Option.of(formValue.city).map(id => CityModel.of(id!)).getOrElse(undefined);

    return model;
  }

  cancelEdit() {
    this.editField = null;
    this.athlete$.next(this.buildModel());
  }

  getField(athlete: AthleteModel | null, field: AthleteField) {
    if (!exists(athlete)) {
      return;
    }

    // @ts-ignore
    return athlete[field.code];
  }

  protected readonly AthleteField = AthleteField;
}
