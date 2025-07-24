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
  description: string | null;
  settings: Record<string, unknown> | null;
}

export interface Contact {
  id: string;
  nom: string;
  prenom: string | null;
  email: string | null;
  telephone: string | null;
  type: 'particulier' | 'entreprise' | null;
  entreprise_id: string | null;
  collaborateur_id: string | null;
  statut: string | null;
  canal_acquisition: string | null;
  date_acquisition: string | null;
  tags: string[] | null;
  commentaires: string | null;
  created_at: string | null;
  updated_at: string | null;
  organization_id: string | null;
}

export interface Entreprise {
  id: string;
  raison_sociale: string;
  siren: string | null;
  siret: string | null;
  secteur: string | null;
  taille: string | null;
  type_relation: string | null;
  adresse: string | null;
  ville: string | null;
  code_postal: string | null;
  pays: string | null;
  tva: string | null;
  iban: string | null;
  bic: string | null;
  banque: string | null;
  commentaires: string | null;
  created_at: string | null;
  updated_at: string | null;
  organization_id: string | null;
}

export interface Company {
  id: string;
  raison_sociale: string;
}

export interface ContactWithEntreprise extends Contact {
  entreprises: Company | null;
}

export interface Quote {
  id: string;
  numero_devis: string;
  contact_id: string | null;
  entreprise_id: string | null;
  organization_id: string;
}
