import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService, Structure } from '../../services/api.service';
import { StructureDetailsComponent } from '../structure-details/structure-details.component';

@Component({
  selector: 'app-structure-list',
  standalone: true,
  imports: [
    CommonModule, 
    MatListModule, 
    MatDialogModule
  ],
  template: `
    <div class="container">
      <h2>Anatomical Structures Data</h2>
      
      <div *ngIf="loading">Loading...</div>
      
      <div *ngIf="error" class="error">
        Error loading structures: {{ errorMessage }}
      </div>
      
      <div class="structures-grid">
        <div class="structure-item" *ngFor="let structure of structures" (click)="openStructureDetails(structure)">
          <div class="structure-name">{{ structure.name }}</div>
          <div class="structure-id" *ngIf="structure.id">({{ structure.id }})</div>
        </div>
      </div>
      
      <div *ngIf="!loading && !error && structures.length === 0">
        No structures found
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .error {
      color: red;
      margin-bottom: 15px;
    }
    
    .structures-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 20px;
    }
    
    .structure-item {
      background-color: #f0f0f0;
      padding: 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .structure-item:hover {
      background-color: #e6e6e6;
    }
    
    .structure-name {
      font-weight: bold;
    }
    
    .structure-id {
      color: #666;
      font-size: 0.9em;
    }
  `]
})
export class StructureListComponent implements OnInit {
  structures: Structure[] = [];
  loading = true;
  error = false;
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.fetchStructures();
  }

  fetchStructures() {
    this.loading = true;
    this.error = false;

    this.apiService.fetchAnatomicalStructures().subscribe({
      next: (structures) => {
        console.log('Fetched Structures:', structures);
        this.structures = structures;
        this.loading = false;
        
        if (structures.length === 0) {
          this.error = true;
          this.errorMessage = 'No structures found';
        }
      },
      error: (err) => {
        console.error('Error in component:', err);
        this.loading = false;
        this.error = true;
        this.errorMessage = err.message || 'Unknown error occurred';
      }
    });
  }

  openStructureDetails(structure: Structure) {
    if (structure.id) {
      this.dialog.open(StructureDetailsComponent, {
        data: { structureId: structure.id }
      });
    } else {
      alert('No details available for this structure');
    }
  }
}