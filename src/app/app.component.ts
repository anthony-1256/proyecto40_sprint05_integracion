import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto40_sprint05_integracion';

  constructor() {
    this.setInitialTheme();
  }

  setInitialTheme () {
    const savedMode = localStorage.getItem('mode');
    const body = document.body;

    if (savedMode === 'dark') {
      body.classList.add('dark-mode');
      body.classList.remove('clear-mode');
    } else {
      body.classList.add('clear-mode');
      body.classList.remove('dark-mode');
    }
  }

}
