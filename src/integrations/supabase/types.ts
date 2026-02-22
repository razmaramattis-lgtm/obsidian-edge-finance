export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      account_entries: {
        Row: {
          account_number: string
          active: boolean
          business_types: string[]
          category_group: string | null
          created_at: string
          description: string | null
          examples: string[] | null
          id: string
          mva_status: string
          name: string
          slug: string
          sort_order: number | null
          tags: string[]
          updated_at: string
        }
        Insert: {
          account_number: string
          active?: boolean
          business_types?: string[]
          category_group?: string | null
          created_at?: string
          description?: string | null
          examples?: string[] | null
          id?: string
          mva_status?: string
          name: string
          slug: string
          sort_order?: number | null
          tags?: string[]
          updated_at?: string
        }
        Update: {
          account_number?: string
          active?: boolean
          business_types?: string[]
          category_group?: string | null
          created_at?: string
          description?: string | null
          examples?: string[] | null
          id?: string
          mva_status?: string
          name?: string
          slug?: string
          sort_order?: number | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      advisor_availability: {
        Row: {
          active: boolean
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          profile_id: string
          start_time: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          day_of_week: number
          end_time?: string
          id?: string
          profile_id: string
          start_time?: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          profile_id?: string
          start_time?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_availability_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_blocked_dates: {
        Row: {
          blocked_date: string
          created_at: string
          id: string
          profile_id: string
          reason: string | null
        }
        Insert: {
          blocked_date: string
          created_at?: string
          id?: string
          profile_id: string
          reason?: string | null
        }
        Update: {
          blocked_date?: string
          created_at?: string
          id?: string
          profile_id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "advisor_blocked_dates_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      advisor_requests: {
        Row: {
          admin_note: string | null
          company_id: string
          created_at: string
          id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          company_id: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          company_id?: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advisor_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      archive_categories: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      archive_files: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          file_name: string | null
          file_size: string | null
          file_url: string | null
          id: string
          name: string
          sort_order: number | null
          updated_at: string
          visibility: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          name: string
          sort_order?: number | null
          updated_at?: string
          visibility?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          updated_at?: string
          visibility?: string
        }
        Relationships: []
      }
      benefit_agreement_applications: {
        Row: {
          admin_note: string | null
          company_id: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          offering: string | null
          price: string | null
          status: string
          title: string
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_note?: string | null
          company_id: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          offering?: string | null
          price?: string | null
          status?: string
          title: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_note?: string | null
          company_id?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          offering?: string | null
          price?: string | null
          status?: string
          title?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "benefit_agreement_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          meta_description: string | null
          meta_title: string | null
          pinned: boolean | null
          published: boolean | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          pinned?: boolean | null
          published?: boolean | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          meta_description?: string | null
          meta_title?: string | null
          pinned?: boolean | null
          published?: boolean | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          advisor_id: string
          booking_date: string
          booking_time: string
          company_name: string
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          message: string | null
          status: string
          teams_link: string | null
          updated_at: string
        }
        Insert: {
          advisor_id: string
          booking_date: string
          booking_time: string
          company_name: string
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          message?: string | null
          status?: string
          teams_link?: string | null
          updated_at?: string
        }
        Update: {
          advisor_id?: string
          booking_date?: string
          booking_time?: string
          company_name?: string
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          message?: string | null
          status?: string
          teams_link?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_advisor_id_fkey"
            columns: ["advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          sort_order: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sort_order?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          category_id: string
          content: string
          created_at: string
          id: string
          sender_id: string
        }
        Insert: {
          category_id: string
          content: string
          created_at?: string
          id?: string
          sender_id: string
        }
        Update: {
          category_id?: string
          content?: string
          created_at?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "chat_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      collaboration_agreements: {
        Row: {
          company: string | null
          contact_name: string | null
          created_at: string
          description: string | null
          email: string | null
          file_name: string | null
          file_url: string | null
          id: string
          logo_url: string | null
          offering: string | null
          partner: string | null
          phone: string | null
          price: string | null
          target_audience: string
          title: string
          updated_at: string
          website: string | null
        }
        Insert: {
          company?: string | null
          contact_name?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          logo_url?: string | null
          offering?: string | null
          partner?: string | null
          phone?: string | null
          price?: string | null
          target_audience?: string
          title: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          company?: string | null
          contact_name?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          logo_url?: string | null
          offering?: string | null
          partner?: string | null
          phone?: string | null
          price?: string | null
          target_audience?: string
          title?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_board_members: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          position: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          position?: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          position?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_board_members_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_contacts: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_contacts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_owners: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          ownership_percent: number
          phone: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          ownership_percent?: number
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          ownership_percent?: number
          phone?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_owners_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          company_name: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          industry_code: string | null
          message: string | null
          org_number: string | null
          package: string | null
          phone: string | null
          revenue_target: string | null
          status: string
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          industry_code?: string | null
          message?: string | null
          org_number?: string | null
          package?: string | null
          phone?: string | null
          revenue_target?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          industry_code?: string | null
          message?: string | null
          org_number?: string | null
          package?: string | null
          phone?: string | null
          revenue_target?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          active: boolean | null
          category: string
          created_at: string
          description: string | null
          duration: string | null
          highlights: Json | null
          id: string
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          slug: string | null
          sort_order: number | null
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          highlights?: Json | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          slug?: string | null
          sort_order?: number | null
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string
          created_at?: string
          description?: string | null
          duration?: string | null
          highlights?: Json | null
          id?: string
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          slug?: string | null
          sort_order?: number | null
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_companies: {
        Row: {
          address: string | null
          auditor: string | null
          backup_advisor_id: string | null
          city: string | null
          company_name: string
          company_type: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          description: string | null
          fiscal_year_end: string | null
          founding_date: string | null
          id: string
          industry: string | null
          logo_url: string | null
          org_number: string | null
          postal_code: string | null
          primary_advisor_id: string | null
          profile_id: string
          share_capital: number | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          auditor?: string | null
          backup_advisor_id?: string | null
          city?: string | null
          company_name: string
          company_type?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          fiscal_year_end?: string | null
          founding_date?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          org_number?: string | null
          postal_code?: string | null
          primary_advisor_id?: string | null
          profile_id: string
          share_capital?: number | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          auditor?: string | null
          backup_advisor_id?: string | null
          city?: string | null
          company_name?: string
          company_type?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          fiscal_year_end?: string | null
          founding_date?: string | null
          id?: string
          industry?: string | null
          logo_url?: string | null
          org_number?: string | null
          postal_code?: string | null
          primary_advisor_id?: string | null
          profile_id?: string
          share_capital?: number | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_companies_backup_advisor_id_fkey"
            columns: ["backup_advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_companies_primary_advisor_id_fkey"
            columns: ["primary_advisor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_companies_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_documents: {
        Row: {
          category: string | null
          company_id: string
          created_at: string
          description: string | null
          file_name: string | null
          file_size: string | null
          file_url: string | null
          id: string
          title: string
          updated_at: string
          uploaded_by: string | null
          visibility: string
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
          uploaded_by?: string | null
          visibility?: string
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_size?: string | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
          uploaded_by?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_employee_invitations: {
        Row: {
          admin_note: string | null
          company_id: string
          created_at: string
          employee_email: string
          employee_name: string
          id: string
          invited_by: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          company_id: string
          created_at?: string
          employee_email: string
          employee_name: string
          id?: string
          invited_by: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          company_id?: string
          created_at?: string
          employee_email?: string
          employee_name?: string
          id?: string
          invited_by?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_employee_invitations_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_employee_invitations_invited_by_fkey"
            columns: ["invited_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_financials: {
        Row: {
          admin_action_plan: string | null
          assets: number | null
          company_id: string
          costs: number
          created_at: string
          equity: number | null
          id: string
          liabilities: number | null
          notes: string | null
          period: string
          result: number
          revenue: number
          updated_at: string
        }
        Insert: {
          admin_action_plan?: string | null
          assets?: number | null
          company_id: string
          costs?: number
          created_at?: string
          equity?: number | null
          id?: string
          liabilities?: number | null
          notes?: string | null
          period: string
          result?: number
          revenue?: number
          updated_at?: string
        }
        Update: {
          admin_action_plan?: string | null
          assets?: number | null
          company_id?: string
          costs?: number
          created_at?: string
          equity?: number | null
          id?: string
          liabilities?: number | null
          notes?: string | null
          period?: string
          result?: number
          revenue?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_financials_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_handbook_chapters: {
        Row: {
          company_id: string
          content: string | null
          created_at: string
          customized: boolean | null
          id: string
          sort_order: number | null
          source_chapter_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          company_id: string
          content?: string | null
          created_at?: string
          customized?: boolean | null
          id?: string
          sort_order?: number | null
          source_chapter_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          content?: string | null
          created_at?: string
          customized?: boolean | null
          id?: string
          sort_order?: number | null
          source_chapter_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_handbook_chapters_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customer_handbook_chapters_source_chapter_id_fkey"
            columns: ["source_chapter_id"]
            isOneToOne: false
            referencedRelation: "hr_handbook"
            referencedColumns: ["id"]
          },
        ]
      }
      document_templates: {
        Row: {
          active: boolean | null
          category: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          merge_fields: Json | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          content: string
          created_at?: string
          description?: string | null
          id?: string
          merge_fields?: Json | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          merge_fields?: Json | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      glossary_terms: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          id: string
          slug: string
          sort_order: number | null
          term: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          slug: string
          sort_order?: number | null
          term: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          id?: string
          slug?: string
          sort_order?: number | null
          term?: string
          updated_at?: string
        }
        Relationships: []
      }
      hms_documents: {
        Row: {
          content: string | null
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      hr_handbook: {
        Row: {
          content: string | null
          created_at: string
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      industries: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          href: string | null
          icon: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      internal_resources: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_name: string | null
          file_url: string | null
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      knowledge_materials: {
        Row: {
          active: boolean | null
          category: string | null
          content: string | null
          created_at: string
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          content?: string | null
          created_at?: string
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partnership_requests: {
        Row: {
          admin_note: string | null
          agreement_id: string
          company_id: string
          created_at: string
          id: string
          message: string | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          agreement_id: string
          company_id: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          agreement_id?: string
          company_id?: string
          created_at?: string
          id?: string
          message?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partnership_requests_agreement_id_fkey"
            columns: ["agreement_id"]
            isOneToOne: false
            referencedRelation: "collaboration_agreements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partnership_requests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "customer_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_plans: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          features: Json | null
          highlighted: boolean | null
          id: string
          name: string
          price: number
          price_suffix: string | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          features?: Json | null
          highlighted?: boolean | null
          id?: string
          name: string
          price?: number
          price_suffix?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          features?: Json | null
          highlighted?: boolean | null
          id?: string
          name?: string
          price?: number
          price_suffix?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          booking_active: boolean
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["app_role"]
          teams_link: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_active?: boolean
          created_at?: string
          email: string
          id?: string
          name: string
          role?: Database["public"]["Enums"]["app_role"]
          teams_link?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_active?: boolean
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["app_role"]
          teams_link?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          active: boolean | null
          category: string | null
          created_at: string
          description: string | null
          file_name: string | null
          file_url: string | null
          id: string
          name: string
          type: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          name: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          category?: string | null
          created_at?: string
          description?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          name?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          created_at: string
          description: string | null
          group_name: string | null
          href: string | null
          icon: string | null
          id: string
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          group_name?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string | null
          group_name?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { uid?: string }; Returns: boolean }
      is_customer: { Args: { uid?: string }; Returns: boolean }
      is_employee_or_admin: { Args: { uid?: string }; Returns: boolean }
      own_company_id: { Args: { uid?: string }; Returns: string }
    }
    Enums: {
      app_role: "admin" | "employee" | "customer"
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
      app_role: ["admin", "employee", "customer"],
    },
  },
} as const
