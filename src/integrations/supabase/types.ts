export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      catalogue: {
        Row: {
          classification: string | null
          commentaires: string | null
          created_at: string | null
          description: string | null
          fiche_produit: string | null
          id: string
          lien_pdf: string | null
          nom: string
          organization_id: string | null
          prix_unitaire_ht: number | null
          reference: string
          statut: string | null
          updated_at: string | null
        }
        Insert: {
          classification?: string | null
          commentaires?: string | null
          created_at?: string | null
          description?: string | null
          fiche_produit?: string | null
          id?: string
          lien_pdf?: string | null
          nom: string
          organization_id?: string | null
          prix_unitaire_ht?: number | null
          reference: string
          statut?: string | null
          updated_at?: string | null
        }
        Update: {
          classification?: string | null
          commentaires?: string | null
          created_at?: string | null
          description?: string | null
          fiche_produit?: string | null
          id?: string
          lien_pdf?: string | null
          nom?: string
          organization_id?: string | null
          prix_unitaire_ht?: number | null
          reference?: string
          statut?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "catalogue_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          canal_acquisition: string | null
          collaborateur_id: string | null
          commentaires: string | null
          created_at: string | null
          date_acquisition: string | null
          email: string | null
          entreprise_id: string | null
          id: string
          nom: string
          organization_id: string | null
          prenom: string | null
          statut: string | null
          tags: string[] | null
          telephone: string | null
          type: Database["public"]["Enums"]["contact_type"] | null
          updated_at: string | null
        }
        Insert: {
          canal_acquisition?: string | null
          collaborateur_id?: string | null
          commentaires?: string | null
          created_at?: string | null
          date_acquisition?: string | null
          email?: string | null
          entreprise_id?: string | null
          id?: string
          nom: string
          organization_id?: string | null
          prenom?: string | null
          statut?: string | null
          tags?: string[] | null
          telephone?: string | null
          type?: Database["public"]["Enums"]["contact_type"] | null
          updated_at?: string | null
        }
        Update: {
          canal_acquisition?: string | null
          collaborateur_id?: string | null
          commentaires?: string | null
          created_at?: string | null
          date_acquisition?: string | null
          email?: string | null
          entreprise_id?: string | null
          id?: string
          nom?: string
          organization_id?: string | null
          prenom?: string | null
          statut?: string | null
          tags?: string[] | null
          telephone?: string | null
          type?: Database["public"]["Enums"]["contact_type"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_collaborateur_id_fkey"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      devis: {
        Row: {
          canal_acquisition: string | null
          commentaires: string | null
          contact_id: string | null
          created_at: string | null
          date_emission: string | null
          entreprise_id: string | null
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          montant_tva: number | null
          numero_devis: string
          organization_id: string | null
          statut: Database["public"]["Enums"]["devis_status"] | null
          updated_at: string | null
          verrouille: boolean | null
        }
        Insert: {
          canal_acquisition?: string | null
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_emission?: string | null
          entreprise_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          montant_tva?: number | null
          numero_devis: string
          organization_id?: string | null
          statut?: Database["public"]["Enums"]["devis_status"] | null
          updated_at?: string | null
          verrouille?: boolean | null
        }
        Update: {
          canal_acquisition?: string | null
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_emission?: string | null
          entreprise_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          montant_tva?: number | null
          numero_devis?: string
          organization_id?: string | null
          statut?: Database["public"]["Enums"]["devis_status"] | null
          updated_at?: string | null
          verrouille?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "devis_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      devis_items: {
        Row: {
          catalogue_id: string | null
          created_at: string | null
          devis_id: string | null
          id: string
          prix_unitaire: number | null
          quantite: number
          remise: number | null
        }
        Insert: {
          catalogue_id?: string | null
          created_at?: string | null
          devis_id?: string | null
          id?: string
          prix_unitaire?: number | null
          quantite?: number
          remise?: number | null
        }
        Update: {
          catalogue_id?: string | null
          created_at?: string | null
          devis_id?: string | null
          id?: string
          prix_unitaire?: number | null
          quantite?: number
          remise?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "devis_items_catalogue_id_fkey"
            columns: ["catalogue_id"]
            isOneToOne: false
            referencedRelation: "catalogue"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devis_items_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
        ]
      }
      entreprises: {
        Row: {
          adresse: string | null
          banque: string | null
          bic: string | null
          code_postal: string | null
          commentaires: string | null
          created_at: string | null
          iban: string | null
          id: string
          organization_id: string | null
          raison_sociale: string
          secteur: string | null
          siren: string | null
          siret: string | null
          site_web: string | null
          taille: string | null
          tva: string | null
          type_relation: string | null
          updated_at: string | null
          ville: string | null
        }
        Insert: {
          adresse?: string | null
          banque?: string | null
          bic?: string | null
          code_postal?: string | null
          commentaires?: string | null
          created_at?: string | null
          iban?: string | null
          id?: string
          organization_id?: string | null
          raison_sociale: string
          secteur?: string | null
          siren?: string | null
          siret?: string | null
          site_web?: string | null
          taille?: string | null
          tva?: string | null
          type_relation?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Update: {
          adresse?: string | null
          banque?: string | null
          bic?: string | null
          code_postal?: string | null
          commentaires?: string | null
          created_at?: string | null
          iban?: string | null
          id?: string
          organization_id?: string | null
          raison_sociale?: string
          secteur?: string | null
          siren?: string | null
          siret?: string | null
          site_web?: string | null
          taille?: string | null
          tva?: string | null
          type_relation?: string | null
          updated_at?: string | null
          ville?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entreprises_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      factures: {
        Row: {
          commentaires: string | null
          conditions_paiement: string | null
          contact_id: string | null
          created_at: string | null
          date_echeance: string | null
          date_emission: string | null
          devis_id: string | null
          entreprise_id: string | null
          id: string
          montant_ht: number | null
          montant_ttc: number | null
          montant_tva: number | null
          numero_facture: string
          organization_id: string | null
          prestation_id: string | null
          statut: Database["public"]["Enums"]["facture_status"] | null
          updated_at: string | null
        }
        Insert: {
          commentaires?: string | null
          conditions_paiement?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_echeance?: string | null
          date_emission?: string | null
          devis_id?: string | null
          entreprise_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          montant_tva?: number | null
          numero_facture: string
          organization_id?: string | null
          prestation_id?: string | null
          statut?: Database["public"]["Enums"]["facture_status"] | null
          updated_at?: string | null
        }
        Update: {
          commentaires?: string | null
          conditions_paiement?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_echeance?: string | null
          date_emission?: string | null
          devis_id?: string | null
          entreprise_id?: string | null
          id?: string
          montant_ht?: number | null
          montant_ttc?: number | null
          montant_tva?: number | null
          numero_facture?: string
          organization_id?: string | null
          prestation_id?: string | null
          statut?: Database["public"]["Enums"]["facture_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "factures_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "factures_prestation_id_fkey"
            columns: ["prestation_id"]
            isOneToOne: false
            referencedRelation: "prestations"
            referencedColumns: ["id"]
          },
        ]
      }
      interactions: {
        Row: {
          collaborateur_id: string | null
          commentaires: string | null
          contact_id: string | null
          created_at: string | null
          date_interaction: string | null
          description: string | null
          entreprise_id: string | null
          heure: string | null
          id: string
          lien_visio: string | null
          organization_id: string | null
          type: Database["public"]["Enums"]["interaction_type"]
          updated_at: string | null
        }
        Insert: {
          collaborateur_id?: string | null
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_interaction?: string | null
          description?: string | null
          entreprise_id?: string | null
          heure?: string | null
          id?: string
          lien_visio?: string | null
          organization_id?: string | null
          type: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string | null
        }
        Update: {
          collaborateur_id?: string | null
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_interaction?: string | null
          description?: string | null
          entreprise_id?: string | null
          heure?: string | null
          id?: string
          lien_visio?: string | null
          organization_id?: string | null
          type?: Database["public"]["Enums"]["interaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interactions_collaborateur_id_fkey"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      kpi: {
        Row: {
          analyse_data: string | null
          canaux: string[] | null
          collaborateur_id: string | null
          created_at: string | null
          date_expiration: string | null
          date_revision: string | null
          designation: string
          id: string
          organization_id: string | null
          reference: string
          updated_at: string | null
          valeur: number | null
        }
        Insert: {
          analyse_data?: string | null
          canaux?: string[] | null
          collaborateur_id?: string | null
          created_at?: string | null
          date_expiration?: string | null
          date_revision?: string | null
          designation: string
          id?: string
          organization_id?: string | null
          reference: string
          updated_at?: string | null
          valeur?: number | null
        }
        Update: {
          analyse_data?: string | null
          canaux?: string[] | null
          collaborateur_id?: string | null
          created_at?: string | null
          date_expiration?: string | null
          date_revision?: string | null
          designation?: string
          id?: string
          organization_id?: string | null
          reference?: string
          updated_at?: string | null
          valeur?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_collaborateur_id_fkey"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kpi_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_members: {
        Row: {
          id: string
          invited_by: string | null
          joined_at: string | null
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          id?: string
          invited_by?: string | null
          joined_at?: string | null
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          settings: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          settings?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          settings?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      paiements: {
        Row: {
          commentaires: string | null
          contact_id: string | null
          created_at: string | null
          date_paiement: string | null
          entreprise_id: string | null
          facture_id: string | null
          id: string
          montant: number | null
          organization_id: string | null
          reference_paiement: string
          reste_a_payer: number | null
          statut: Database["public"]["Enums"]["paiement_status"] | null
          type_paiement: string | null
          updated_at: string | null
        }
        Insert: {
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_paiement?: string | null
          entreprise_id?: string | null
          facture_id?: string | null
          id?: string
          montant?: number | null
          organization_id?: string | null
          reference_paiement: string
          reste_a_payer?: number | null
          statut?: Database["public"]["Enums"]["paiement_status"] | null
          type_paiement?: string | null
          updated_at?: string | null
        }
        Update: {
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_paiement?: string | null
          entreprise_id?: string | null
          facture_id?: string | null
          id?: string
          montant?: number | null
          organization_id?: string | null
          reference_paiement?: string
          reste_a_payer?: number | null
          statut?: Database["public"]["Enums"]["paiement_status"] | null
          type_paiement?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "paiements_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_facture_id_fkey"
            columns: ["facture_id"]
            isOneToOne: false
            referencedRelation: "factures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      prestations: {
        Row: {
          commentaires: string | null
          contact_id: string | null
          created_at: string | null
          date_debut: string | null
          date_fin: string | null
          designation: string
          devis_id: string | null
          entreprise_id: string | null
          id: string
          intervenants: string[] | null
          localisation: string | null
          montant: number | null
          organization_id: string | null
          reference: string
          statut: Database["public"]["Enums"]["prestation_status"] | null
          updated_at: string | null
        }
        Insert: {
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          designation: string
          devis_id?: string | null
          entreprise_id?: string | null
          id?: string
          intervenants?: string[] | null
          localisation?: string | null
          montant?: number | null
          organization_id?: string | null
          reference: string
          statut?: Database["public"]["Enums"]["prestation_status"] | null
          updated_at?: string | null
        }
        Update: {
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_fin?: string | null
          designation?: string
          devis_id?: string | null
          entreprise_id?: string | null
          id?: string
          intervenants?: string[] | null
          localisation?: string | null
          montant?: number | null
          organization_id?: string | null
          reference?: string
          statut?: Database["public"]["Enums"]["prestation_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prestations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prestations_devis_id_fkey"
            columns: ["devis_id"]
            isOneToOne: false
            referencedRelation: "devis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prestations_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prestations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          competences: string[] | null
          created_at: string | null
          date_arrivee: string | null
          date_depart: string | null
          email: string
          fonction: string | null
          id: string
          nom: string
          prenom: string
          role: Database["public"]["Enums"]["user_role"] | null
          statut: string | null
          tags: string[] | null
          telephone: string | null
          updated_at: string | null
        }
        Insert: {
          competences?: string[] | null
          created_at?: string | null
          date_arrivee?: string | null
          date_depart?: string | null
          email: string
          fonction?: string | null
          id: string
          nom: string
          prenom: string
          role?: Database["public"]["Enums"]["user_role"] | null
          statut?: string | null
          tags?: string[] | null
          telephone?: string | null
          updated_at?: string | null
        }
        Update: {
          competences?: string[] | null
          created_at?: string | null
          date_arrivee?: string | null
          date_depart?: string | null
          email?: string
          fonction?: string | null
          id?: string
          nom?: string
          prenom?: string
          role?: Database["public"]["Enums"]["user_role"] | null
          statut?: string | null
          tags?: string[] | null
          telephone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reclamations: {
        Row: {
          commentaires: string | null
          contact_id: string | null
          created_at: string | null
          description: string | null
          entreprise_id: string | null
          id: string
          numero_reclamation: string
          organization_id: string | null
          statut: Database["public"]["Enums"]["reclamation_status"] | null
          theme: string | null
          type_theme: string | null
          updated_at: string | null
        }
        Insert: {
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string | null
          entreprise_id?: string | null
          id?: string
          numero_reclamation: string
          organization_id?: string | null
          statut?: Database["public"]["Enums"]["reclamation_status"] | null
          theme?: string | null
          type_theme?: string | null
          updated_at?: string | null
        }
        Update: {
          commentaires?: string | null
          contact_id?: string | null
          created_at?: string | null
          description?: string | null
          entreprise_id?: string | null
          id?: string
          numero_reclamation?: string
          organization_id?: string | null
          statut?: Database["public"]["Enums"]["reclamation_status"] | null
          theme?: string | null
          type_theme?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reclamations_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reclamations_entreprise_id_fkey"
            columns: ["entreprise_id"]
            isOneToOne: false
            referencedRelation: "entreprises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reclamations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          id: string
          organization_id: string
          plan_id: string | null
          plan_name: string | null
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id: string
          plan_id?: string | null
          plan_name?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          organization_id?: string
          plan_id?: string | null
          plan_name?: string | null
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      taches: {
        Row: {
          collaborateur_id: string | null
          commentaires: string | null
          created_at: string | null
          date_debut: string | null
          date_echeance: string | null
          date_fin: string | null
          description: string | null
          id: string
          nom: string
          organization_id: string | null
          reference: string
          statut: Database["public"]["Enums"]["tache_status"] | null
          updated_at: string | null
        }
        Insert: {
          collaborateur_id?: string | null
          commentaires?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_echeance?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          nom: string
          organization_id?: string | null
          reference: string
          statut?: Database["public"]["Enums"]["tache_status"] | null
          updated_at?: string | null
        }
        Update: {
          collaborateur_id?: string | null
          commentaires?: string | null
          created_at?: string | null
          date_debut?: string | null
          date_echeance?: string | null
          date_fin?: string | null
          description?: string | null
          id?: string
          nom?: string
          organization_id?: string | null
          reference?: string
          statut?: Database["public"]["Enums"]["tache_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "taches_collaborateur_id_fkey"
            columns: ["collaborateur_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "taches_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_organization_id: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_organization_admin: {
        Args: { check_organization_id: string; check_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      contact_type: "particulier" | "entreprise"
      devis_status: "brouillon" | "envoye" | "accepte" | "refuse" | "expire"
      facture_status:
        | "brouillon"
        | "envoyee"
        | "payee"
        | "en_retard"
        | "annulee"
      interaction_type:
        | "email"
        | "appel"
        | "tchat"
        | "reunion_presentiel"
        | "reunion_distanciel"
        | "formulaire"
        | "rencontre"
      paiement_status: "en_attente" | "recu" | "rapproche"
      prestation_status: "planifie" | "en_cours" | "termine" | "annule"
      reclamation_status: "prise_en_compte" | "en_cours" | "traitee" | "rejetee"
      tache_status: "a_faire" | "en_cours" | "terminee" | "annulee"
      user_role: "admin" | "manager" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      contact_type: ["particulier", "entreprise"],
      devis_status: ["brouillon", "envoye", "accepte", "refuse", "expire"],
      facture_status: ["brouillon", "envoyee", "payee", "en_retard", "annulee"],
      interaction_type: [
        "email",
        "appel",
        "tchat",
        "reunion_presentiel",
        "reunion_distanciel",
        "formulaire",
        "rencontre",
      ],
      paiement_status: ["en_attente", "recu", "rapproche"],
      prestation_status: ["planifie", "en_cours", "termine", "annule"],
      reclamation_status: ["prise_en_compte", "en_cours", "traitee", "rejetee"],
      tache_status: ["a_faire", "en_cours", "terminee", "annulee"],
      user_role: ["admin", "manager", "user"],
    },
  },
} as const
