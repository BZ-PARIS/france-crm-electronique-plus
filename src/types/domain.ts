export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  settings?: Record<string, unknown>;
}

export interface Contact {
  id: string;
  nom: string;
  prenom?: string;
  email?: string;
  telephone?: string;
  organization_id: string;
}

export interface Company {
  id: string;
  raison_sociale: string;
}

export interface ContactWithEntreprise extends Contact {
  entreprises?: Company | null;
}

export interface Quote {
  id: string;
  numero_devis: string;
  contact_id?: string;
  entreprise_id?: string;
  organization_id: string;
}
