import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  MAT_DIALOG_DATA, 
  MatDialogRef, 
  MatDialogModule 
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';

// Define the interface for structure details
export interface StructureDetails {
  label: string;
  description?: string;
  obo_id: string;
  iri: string;
}

@Component({
  selector: 'app-structure-details',
  standalone: true,
  imports: [
    CommonModule, 
    MatDialogModule, 
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div *ngIf="loading">Loading...</div>
    
    <div *ngIf="structureDetails">
      <h2 mat-dialog-title>
        {{ structureDetails.label }}
        <button mat-icon-button (click)="onClose()">
          X
        </button>
      </h2>
      
      <div mat-dialog-content>
        <p><strong>Description:</strong> {{ structureDetails.description || 'No description available' }}</p>
        <p><strong>OBO ID:</strong> {{ structureDetails.obo_id }}</p>
        <p><strong>IRI:</strong> {{ structureDetails.iri }}</p>
      </div>
    </div>
    
    <div *ngIf="error">
      <p>No details found for this structure.</p>
    </div>
  `
})
export class StructureDetailsComponent implements OnInit {
  structureDetails: StructureDetails | null = null;
  loading = true;
  error = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { structureId: string },
    private dialogRef: MatDialogRef<StructureDetailsComponent>,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    if (this.data.structureId) {
      this.fetchStructureDetails(this.data.structureId);
    } else {
      this.error = true;
      this.loading = false;
    }
  }

  fetchStructureDetails(id: string) {
    // Update the API service to include this method
    const url = `https://www.ebi.ac.uk/ols/api/ontologies/uberon/terms?iri=http://purl.obolibrary.org/obo/${id.replace(':', '_')}`;

    this.apiService.fetchStructureDetails(url).subscribe({
      next: (details) => {
        this.structureDetails = details;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}