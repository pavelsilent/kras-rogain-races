import { AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOption } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { first, firstValueFrom, Observable, ReplaySubject, startWith, switchMap } from 'rxjs';
import { AddAthleteDialogComponent } from '../../dialogs/add-athlete-dialog/add-athlete-dialog.component';
import { AthleteModel } from '../../models/athlete.model';
import { EnumPipe } from '../../utils/enum.pipe';
import { BoolPipe } from '../../utils/list.pipe';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { RussianDateTimePipe } from '../../utils/russian-date-time.pipe';
import { RussianDatePipe } from '../../utils/russian-date.pipe';
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
               BoolPipe,
               RussianDateTimePipe,
             ],
             providers: [
               { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
               { provide: MAT_DATE_FORMATS, useValue: RU_DATE_FORMATS },
             ],
             templateUrl: './athlete.component.html',
             standalone: true,
             styleUrl: './athlete.component.css',
           })
export class AthleteComponent {
  athleteId!: number;
  athlete$: Observable<AthleteModel>;
  refresh$: ReplaySubject<void> = new ReplaySubject<void>();

  constructor(private route: ActivatedRoute, private service: AthletesService, private dialog: MatDialog) {
    this.athleteId = Number(this.route.snapshot.paramMap.get('id'));
    this.athlete$ =
      this.refresh$.pipe(
        startWith(null),
        switchMap(value => this.service.getAthleteById(this.athleteId)),
      );
  }

  onEdit() {
    this.athlete$.pipe(first()).subscribe(athlete => {
      const dialogRef = this.dialog.open(AddAthleteDialogComponent, {
        data: { athlete },
        width: '500px',
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) { // если данные были изменены
          this.refresh$.next();
        }
      });
    });
  }
}
