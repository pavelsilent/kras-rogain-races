import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
             selector: 'app-not-found.component',
             imports: [RouterModule, MatButtonModule, MatIconModule, MatCardModule],
             templateUrl: './not-found.component.html',
             standalone: true,
             styleUrl: './not-found.component.css',
           })
export class NotFoundComponent {

}
