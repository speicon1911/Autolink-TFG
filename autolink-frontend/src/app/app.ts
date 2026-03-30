import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollButtonsComponent } from './shared/components/scroll-buttons/scroll-buttons.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScrollButtonsComponent],
  template: `
    <router-outlet></router-outlet>
    <app-scroll-buttons></app-scroll-buttons>
  `
})
export class AppComponent { }
