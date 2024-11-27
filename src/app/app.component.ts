import { Component } from '@angular/core';
import { StructureListComponent } from './components/structure-list/structure-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    StructureListComponent
  ],
  template: `
    <app-structure-list></app-structure-list>
  `
})
export class AppComponent {}