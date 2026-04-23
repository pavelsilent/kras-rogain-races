import { AsyncPipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButton } from '@angular/material/button';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { first, Observable, ReplaySubject, startWith, switchMap } from 'rxjs';
import { AddAthleteDialogComponent } from '../../dialogs/add-athlete-dialog/add-athlete-dialog.component';
import { AthleteModel } from '../../models/athlete.model';
import { EnumPipe } from '../../utils/enum.pipe';
import { RU_DATE_FORMATS } from '../../utils/mat-date-formats';
import { RussianDatePipe } from '../../utils/russian-date.pipe';
import { AthletesService } from '../athlete-list/athletes.service';

@Component({
             selector: 'app-athlete.component',
             imports: [
               MatButton,
               ReactiveFormsModule,
               MatMomentDateModule,
               AsyncPipe,
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
