import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from "./core/footer/footer";
import { Cabecera } from './core/cabecera/cabecera';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Cabecera, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('autolink-frontend');
}
