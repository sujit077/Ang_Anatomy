import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export enum BM_TYPE {
  GENE = 'gene',
  PROTEIN = 'protein'
}

export interface Structure {
  name?: string;
  id?: string;
  rdfs_label?: string;
  b_type?: BM_TYPE;
}

export interface Row {
  anatomical_structures: Array<Structure>;
  cell_types: Array<Structure>;
  biomarkers: Array<Structure>;
}

export interface StructureDetails {
  label: string;
  description?: string;
  obo_id: string;
  iri: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private firstApiUrl = 'https://apps.humanatlas.io/asctb-api/v2/1SqNmcPDB8PrZF1BhzgdKBxkfLcCR8VYMAkSIbnK_AXA/949267305';

  constructor(private http: HttpClient) {}

  fetchAnatomicalStructures(): Observable<Structure[]> {
    return this.http.get<any>(this.firstApiUrl).pipe(
      map(response => {
        let structures: Structure[] = [];
  
        // Check multiple possible ways the data might be structured
        if (Array.isArray(response)) {
          structures = this.extractStructuresFromArray(response);
        } else if (response && Array.isArray(response.data)) {
          structures = this.extractStructuresFromArray(response.data);
        } else if (response && Array.isArray(response.result)) {
          structures = this.extractStructuresFromArray(response.result);
        } else {
          console.error('Unexpected response format:', response);
        }
  
        // Remove duplicates by name while preserving the first occurrence's full details
        const uniqueStructuresMap = new Map<string, Structure>();
        structures.forEach(structure => {
          if (structure.name && !uniqueStructuresMap.has(structure.name)) {
            uniqueStructuresMap.set(structure.name, structure);
          }
        });
  
        return Array.from(uniqueStructuresMap.values());
      }),
      catchError(error => {
        console.error('Error fetching anatomical structures:', error);
        return of([]);
      })
    );
  }

  fetchStructureDetails(url: string): Observable<StructureDetails | null> {
    return this.http.get<any>(url).pipe(
      map(response => {
        if (response.terms && response.terms.length > 0) {
          const term = response.terms[0];
          return {
            label: term.label,
            description: term.annotation?.definition || term.description,
            obo_id: term.obo_id,
            iri: term.iri
          };
        }
        return null;
      }),
      catchError(error => {
        console.error('Error fetching structure details:', error);
        return of(null);
      })
    );
  }

  private extractStructuresFromArray(rows: any[]): Structure[] {
    const structures: Structure[] = [];
    
    rows.forEach(row => {
      // Check for different possible paths to anatomical structures
      const anatomicalStructures = 
        row.anatomical_structures || 
        row.anatomicalStructures || 
        row['anatomical-structures'] || 
        (Array.isArray(row) ? row : []);
  
      if (Array.isArray(anatomicalStructures)) {
        anatomicalStructures.forEach((structure: Structure) => {
          if (structure && structure.name) {
            structures.push({
              name: structure.name,
              id: structure.id || structure.rdfs_label, // Fallback to rdfs_label if id is not present
              rdfs_label: structure.rdfs_label,
              b_type: structure.b_type
            });
          }
        });
      }
    });
  
    return structures;
  }
}