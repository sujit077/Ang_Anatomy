// src/app/models/structure.model.ts

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