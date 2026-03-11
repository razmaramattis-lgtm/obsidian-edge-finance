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
          related_accounts: string[]
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
          related_accounts?: string[]
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
          related_accounts?: string[]
          slug?: string
          sort_order?: number | null
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      account_feedback: {
        Row: {
          admin_note: string | null
          created_at: string
          id: string
          message: string | null
          search_term: string
          status: string
          top_result_account: string | null
          top_result_name: string | null
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          id?: string
          message?: string | null
          search_term: string
          status?: string
          top_result_account?: string | null
          top_result_name?: string | null
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          id?: string
          message?: string | null
          search_term?: string
          status?: string
          top_result_account?: string | null
          top_result_name?: string | null
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
      audit_log: {
        Row: {
          action: string
          actor_email: string | null
          actor_id: string | null
          created_at: string
          details: Json | null
          id: string
          ip_address: string | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
        }
        Insert: {
          action: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
        }
        Update: {
          action?: string
          actor_email?: string | null
          actor_id?: string | null
          created_at?: string
          details?: Json | null
          id?: string
          ip_address?: string | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ava_account_overrides: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          preferred_account_number: string
          search_term: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          preferred_account_number: string
          search_term: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          preferred_account_number?: string
          search_term?: string
        }
        Relationships: [
          {
            foreignKeyName: "ava_account_overrides_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ava_document_overrides: {
        Row: {
          created_at: string
          created_by: string | null
          document_title: string
          document_url: string | null
          file_name: string | null
          id: string
          search_term: string
          source_table: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          document_title: string
          document_url?: string | null
          file_name?: string | null
          id?: string
          search_term: string
          source_table?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          document_title?: string
          document_url?: string | null
          file_name?: string | null
          id?: string
          search_term?: string
          source_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ava_document_overrides_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          section: string | null
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
          section?: string | null
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
          section?: string | null
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
          section: string | null
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
          section?: string | null
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
          section?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          active: boolean | null
          category: string
          coming_soon: boolean
          created_at: string
          description: string | null
          duration: string | null
          has_certificate: boolean
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
          coming_soon?: boolean
          created_at?: string
          description?: string | null
          duration?: string | null
          has_certificate?: boolean
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
          coming_soon?: boolean
          created_at?: string
          description?: string | null
          duration?: string | null
          has_certificate?: boolean
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
          accounting_system: string | null
          address: string | null
          annual_revenue: string | null
          auditor: string | null
          backup_advisor_id: string | null
          bank: string | null
          city: string | null
          company_name: string
          company_type: string | null
          contact_phone: string | null
          country: string | null
          created_at: string
          description: string | null
          employer_registered: boolean | null
          fiscal_year_end: string | null
          founding_date: string | null
          id: string
          industry: string | null
          insurance_company: string | null
          internal_notes: string | null
          logo_url: string | null
          num_employees: number | null
          org_number: string | null
          postal_code: string | null
          primary_advisor_id: string | null
          profile_id: string
          share_capital: number | null
          updated_at: string
          vat_registered: boolean | null
          website: string | null
        }
        Insert: {
          accounting_system?: string | null
          address?: string | null
          annual_revenue?: string | null
          auditor?: string | null
          backup_advisor_id?: string | null
          bank?: string | null
          city?: string | null
          company_name: string
          company_type?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          employer_registered?: boolean | null
          fiscal_year_end?: string | null
          founding_date?: string | null
          id?: string
          industry?: string | null
          insurance_company?: string | null
          internal_notes?: string | null
          logo_url?: string | null
          num_employees?: number | null
          org_number?: string | null
          postal_code?: string | null
          primary_advisor_id?: string | null
          profile_id: string
          share_capital?: number | null
          updated_at?: string
          vat_registered?: boolean | null
          website?: string | null
        }
        Update: {
          accounting_system?: string | null
          address?: string | null
          annual_revenue?: string | null
          auditor?: string | null
          backup_advisor_id?: string | null
          bank?: string | null
          city?: string | null
          company_name?: string
          company_type?: string | null
          contact_phone?: string | null
          country?: string | null
          created_at?: string
          description?: string | null
          employer_registered?: boolean | null
          fiscal_year_end?: string | null
          founding_date?: string | null
          id?: string
          industry?: string | null
          insurance_company?: string | null
          internal_notes?: string | null
          logo_url?: string | null
          num_employees?: number | null
          org_number?: string | null
          postal_code?: string | null
          primary_advisor_id?: string | null
          profile_id?: string
          share_capital?: number | null
          updated_at?: string
          vat_registered?: boolean | null
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
      dm_conversations: {
        Row: {
          created_at: string
          id: string
          participant_1: string
          participant_2: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          participant_1: string
          participant_2: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          participant_1?: string
          participant_2?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_conversations_participant_1_fkey"
            columns: ["participant_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dm_conversations_participant_2_fkey"
            columns: ["participant_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "dm_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dm_message_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          file_name: string | null
          file_url: string | null
          id: string
          read_at: string | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          read_at?: string | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          id?: string
          read_at?: string | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "dm_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dm_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
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
      email_campaign_contacts: {
        Row: {
          campaign_id: string
          created_at: string
          email: string
          id: string
          name: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_campaigns: {
        Row: {
          created_at: string
          created_by: string | null
          failed_count: number
          id: string
          message: string
          name: string
          scheduled_at: string | null
          sent_count: number
          status: string
          subject: string
          total_recipients: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          failed_count?: number
          id?: string
          message?: string
          name: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject?: string
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          failed_count?: number
          id?: string
          message?: string
          name?: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          subject?: string
          total_recipients?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contact_group_members: {
        Row: {
          contact_id: string
          created_at: string
          group_id: string
          id: string
        }
        Insert: {
          contact_id: string
          created_at?: string
          group_id: string
          id?: string
        }
        Update: {
          contact_id?: string
          created_at?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_contact_group_members_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "email_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_contact_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "email_contact_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      email_contact_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      email_contacts: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      email_messages: {
        Row: {
          body: string
          campaign_id: string | null
          created_at: string
          error_message: string | null
          id: string
          recipient_email: string
          recipient_name: string | null
          retry_count: number
          sent_at: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          body: string
          campaign_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email: string
          recipient_name?: string | null
          retry_count?: number
          sent_at?: string | null
          status?: string
          subject: string
          updated_at?: string
        }
        Update: {
          body?: string
          campaign_id?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          recipient_name?: string | null
          retry_count?: number
          sent_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "email_campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      email_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          subject?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      employee_panel_access: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          panel_key: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          panel_key: string
          profile_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          panel_key?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "employee_panel_access_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_panel_access_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      group_files: {
        Row: {
          created_at: string
          file_name: string
          file_size: string | null
          file_type: string
          file_url: string
          folder: string
          group_id: string
          id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_size?: string | null
          file_type?: string
          file_url: string
          folder?: string
          group_id: string
          id?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_size?: string | null
          file_type?: string
          file_url?: string
          folder?: string
          group_id?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_files_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "workspace_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_message_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          message_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          emoji: string
          id?: string
          message_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          message_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "workspace_group_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_message_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_message_reads: {
        Row: {
          id: string
          message_id: string
          profile_id: string
          read_at: string
        }
        Insert: {
          id?: string
          message_id: string
          profile_id: string
          read_at?: string
        }
        Update: {
          id?: string
          message_id?: string
          profile_id?: string
          read_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_message_reads_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "workspace_group_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_message_reads_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          body: string | null
          challenges: Json | null
          created_at: string
          cta_headline: string | null
          deliverables: string[] | null
          description: string | null
          hero_image_url: string | null
          href: string | null
          icon: string | null
          id: string
          intro: string | null
          meta_description: string | null
          meta_title: string | null
          quote: Json | null
          related_slugs: Json | null
          slug: string | null
          sort_order: number | null
          tagline: string | null
          title: string
          updated_at: string
          why_avargo: Json | null
        }
        Insert: {
          active?: boolean | null
          body?: string | null
          challenges?: Json | null
          created_at?: string
          cta_headline?: string | null
          deliverables?: string[] | null
          description?: string | null
          hero_image_url?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          intro?: string | null
          meta_description?: string | null
          meta_title?: string | null
          quote?: Json | null
          related_slugs?: Json | null
          slug?: string | null
          sort_order?: number | null
          tagline?: string | null
          title: string
          updated_at?: string
          why_avargo?: Json | null
        }
        Update: {
          active?: boolean | null
          body?: string | null
          challenges?: Json | null
          created_at?: string
          cta_headline?: string | null
          deliverables?: string[] | null
          description?: string | null
          hero_image_url?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          intro?: string | null
          meta_description?: string | null
          meta_title?: string | null
          quote?: Json | null
          related_slugs?: Json | null
          slug?: string | null
          sort_order?: number | null
          tagline?: string | null
          title?: string
          updated_at?: string
          why_avargo?: Json | null
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
      job_applications: {
        Row: {
          address: string | null
          admin_note: string | null
          city: string | null
          created_at: string
          cv_file_name: string | null
          cv_url: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          job_listing_id: string
          message: string | null
          phone: string
          postal_code: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_note?: string | null
          city?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          id?: string
          job_listing_id: string
          message?: string | null
          phone: string
          postal_code?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_note?: string | null
          city?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          job_listing_id?: string
          message?: string | null
          phone?: string
          postal_code?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_listing_id_fkey"
            columns: ["job_listing_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          about_company: string | null
          active: boolean
          category: string
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          contact_title: string | null
          created_at: string
          deadline: string | null
          description: string | null
          employment_type: string
          highlights: string[] | null
          id: string
          images: string[] | null
          intro: string | null
          location: string
          num_positions: number
          published: boolean
          qualifications: string | null
          slug: string
          start_date: string
          tasks: string | null
          title: string
          updated_at: string
          we_offer: string | null
          work_hours: string
          work_language: string
          work_location: string
        }
        Insert: {
          about_company?: string | null
          active?: boolean
          category?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          employment_type?: string
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          intro?: string | null
          location?: string
          num_positions?: number
          published?: boolean
          qualifications?: string | null
          slug: string
          start_date?: string
          tasks?: string | null
          title: string
          updated_at?: string
          we_offer?: string | null
          work_hours?: string
          work_language?: string
          work_location?: string
        }
        Update: {
          about_company?: string | null
          active?: boolean
          category?: string
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          contact_title?: string | null
          created_at?: string
          deadline?: string | null
          description?: string | null
          employment_type?: string
          highlights?: string[] | null
          id?: string
          images?: string[] | null
          intro?: string | null
          location?: string
          num_positions?: number
          published?: boolean
          qualifications?: string | null
          slug?: string
          start_date?: string
          tasks?: string | null
          title?: string
          updated_at?: string
          we_offer?: string | null
          work_hours?: string
          work_language?: string
          work_location?: string
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
      marketing_ai_insights: {
        Row: {
          active: boolean | null
          based_on_posts: number | null
          confidence: number | null
          created_at: string
          id: string
          insight_type: string
          platform: string | null
          recommendation: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          based_on_posts?: number | null
          confidence?: number | null
          created_at?: string
          id?: string
          insight_type: string
          platform?: string | null
          recommendation: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          based_on_posts?: number | null
          confidence?: number | null
          created_at?: string
          id?: string
          insight_type?: string
          platform?: string | null
          recommendation?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget: number | null
          budget_currency: string | null
          clicks: number | null
          conversions: number | null
          cpc: number | null
          created_at: string
          created_by: string | null
          cta: string | null
          ctr: number | null
          description: string | null
          end_date: string | null
          headline: string | null
          id: string
          impressions: number | null
          name: string
          platform: string
          spend: number | null
          start_date: string | null
          status: string
          target_audience: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          budget_currency?: string | null
          clicks?: number | null
          conversions?: number | null
          cpc?: number | null
          created_at?: string
          created_by?: string | null
          cta?: string | null
          ctr?: number | null
          description?: string | null
          end_date?: string | null
          headline?: string | null
          id?: string
          impressions?: number | null
          name: string
          platform?: string
          spend?: number | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          budget_currency?: string | null
          clicks?: number | null
          conversions?: number | null
          cpc?: number | null
          created_at?: string
          created_by?: string | null
          cta?: string | null
          ctr?: number | null
          description?: string | null
          end_date?: string | null
          headline?: string | null
          id?: string
          impressions?: number | null
          name?: string
          platform?: string
          spend?: number | null
          start_date?: string | null
          status?: string
          target_audience?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_content_analyses: {
        Row: {
          content_summary: string | null
          crawled_at: string
          created_at: string
          id: string
          keywords: string[] | null
          raw_content: string | null
          themes: string[] | null
          title: string | null
          tone: string | null
          updated_at: string
          url: string
        }
        Insert: {
          content_summary?: string | null
          crawled_at?: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          raw_content?: string | null
          themes?: string[] | null
          title?: string | null
          tone?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          content_summary?: string | null
          crawled_at?: string
          created_at?: string
          id?: string
          keywords?: string[] | null
          raw_content?: string | null
          themes?: string[] | null
          title?: string | null
          tone?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      marketing_integrations: {
        Row: {
          access_token: string | null
          account_id: string | null
          account_name: string | null
          connected: boolean
          connected_at: string | null
          connected_by: string | null
          created_at: string
          disconnected_at: string | null
          id: string
          metadata: Json | null
          platform: string
          platform_label: string
          refresh_token: string | null
          scopes: string[] | null
          token_expires_at: string | null
          updated_at: string
        }
        Insert: {
          access_token?: string | null
          account_id?: string | null
          account_name?: string | null
          connected?: boolean
          connected_at?: string | null
          connected_by?: string | null
          created_at?: string
          disconnected_at?: string | null
          id?: string
          metadata?: Json | null
          platform: string
          platform_label: string
          refresh_token?: string | null
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          access_token?: string | null
          account_id?: string | null
          account_name?: string | null
          connected?: boolean
          connected_at?: string | null
          connected_by?: string | null
          created_at?: string
          disconnected_at?: string | null
          id?: string
          metadata?: Json | null
          platform?: string
          platform_label?: string
          refresh_token?: string | null
          scopes?: string[] | null
          token_expires_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_integrations_connected_by_fkey"
            columns: ["connected_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_performance: {
        Row: {
          clicks: number | null
          comments: number | null
          conversions: number | null
          created_at: string
          date: string
          engagement_rate: number | null
          id: string
          impressions: number | null
          leads: number | null
          likes: number | null
          reach: number | null
          reference_id: string | null
          reference_type: string | null
          shares: number | null
          source: string
          source_type: string
          spend: number | null
          video_views: number | null
        }
        Insert: {
          clicks?: number | null
          comments?: number | null
          conversions?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          leads?: number | null
          likes?: number | null
          reach?: number | null
          reference_id?: string | null
          reference_type?: string | null
          shares?: number | null
          source: string
          source_type?: string
          spend?: number | null
          video_views?: number | null
        }
        Update: {
          clicks?: number | null
          comments?: number | null
          conversions?: number | null
          created_at?: string
          date?: string
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          leads?: number | null
          likes?: number | null
          reach?: number | null
          reference_id?: string | null
          reference_type?: string | null
          shares?: number | null
          source?: string
          source_type?: string
          spend?: number | null
          video_views?: number | null
        }
        Relationships: []
      }
      marketing_posts: {
        Row: {
          ai_generated: boolean | null
          approved_by: string | null
          content: string
          created_at: string
          created_by: string | null
          hashtags: string[] | null
          id: string
          image_prompt: string | null
          image_url: string | null
          platform: string
          published_at: string | null
          rejected_reason: string | null
          scheduled_at: string | null
          source_analysis_id: string | null
          status: string
          strategy_plan_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          ai_generated?: boolean | null
          approved_by?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          hashtags?: string[] | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          platform?: string
          published_at?: string | null
          rejected_reason?: string | null
          scheduled_at?: string | null
          source_analysis_id?: string | null
          status?: string
          strategy_plan_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          ai_generated?: boolean | null
          approved_by?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          hashtags?: string[] | null
          id?: string
          image_prompt?: string | null
          image_url?: string | null
          platform?: string
          published_at?: string | null
          rejected_reason?: string | null
          scheduled_at?: string | null
          source_analysis_id?: string | null
          status?: string
          strategy_plan_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_posts_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_posts_source_analysis_id_fkey"
            columns: ["source_analysis_id"]
            isOneToOne: false
            referencedRelation: "marketing_content_analyses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketing_posts_strategy_plan_id_fkey"
            columns: ["strategy_plan_id"]
            isOneToOne: false
            referencedRelation: "marketing_strategy_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      marketing_strategy_plans: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          goals: Json | null
          id: string
          platforms: string[]
          start_date: string
          status: string
          title: string
          updated_at: string
          weekly_campaigns: Json | null
          weekly_posts: Json | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          goals?: Json | null
          id?: string
          platforms?: string[]
          start_date: string
          status?: string
          title: string
          updated_at?: string
          weekly_campaigns?: Json | null
          weekly_posts?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          goals?: Json | null
          id?: string
          platforms?: string[]
          start_date?: string
          status?: string
          title?: string
          updated_at?: string
          weekly_campaigns?: Json | null
          weekly_posts?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "marketing_strategy_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      open_applications: {
        Row: {
          address: string | null
          admin_note: string | null
          available_from: string | null
          city: string | null
          created_at: string
          cv_file_name: string | null
          cv_url: string | null
          date_of_birth: string | null
          email: string
          full_name: string
          id: string
          linkedin_url: string | null
          message: string | null
          phone: string
          portfolio_url: string | null
          postal_code: string | null
          preferred_category: string | null
          status: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          admin_note?: string | null
          available_from?: string | null
          city?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          email: string
          full_name: string
          id?: string
          linkedin_url?: string | null
          message?: string | null
          phone: string
          portfolio_url?: string | null
          postal_code?: string | null
          preferred_category?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          admin_note?: string | null
          available_from?: string | null
          city?: string | null
          created_at?: string
          cv_file_name?: string | null
          cv_url?: string | null
          date_of_birth?: string | null
          email?: string
          full_name?: string
          id?: string
          linkedin_url?: string | null
          message?: string | null
          phone?: string
          portfolio_url?: string | null
          postal_code?: string | null
          preferred_category?: string | null
          status?: string
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
          section: string | null
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
          section?: string | null
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
          section?: string | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      profile_specialties: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          profile_id: string
          sort_order: number | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          profile_id: string
          sort_order?: number | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          profile_id?: string
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profile_specialties_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          avatar_url: string | null
          background_url: string | null
          bio: string | null
          booking_active: boolean
          created_at: string
          department: string | null
          email: string
          id: string
          interests: string[] | null
          last_seen_at: string | null
          name: string
          outlook_calendar_url: string | null
          phone: string | null
          preferred_accounting_systems: string[] | null
          role: Database["public"]["Enums"]["app_role"]
          specialty: string | null
          teams_link: string | null
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean
          avatar_url?: string | null
          background_url?: string | null
          bio?: string | null
          booking_active?: boolean
          created_at?: string
          department?: string | null
          email: string
          id?: string
          interests?: string[] | null
          last_seen_at?: string | null
          name: string
          outlook_calendar_url?: string | null
          phone?: string | null
          preferred_accounting_systems?: string[] | null
          role?: Database["public"]["Enums"]["app_role"]
          specialty?: string | null
          teams_link?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean
          avatar_url?: string | null
          background_url?: string | null
          bio?: string | null
          booking_active?: boolean
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          interests?: string[] | null
          last_seen_at?: string | null
          name?: string
          outlook_calendar_url?: string | null
          phone?: string | null
          preferred_accounting_systems?: string[] | null
          role?: Database["public"]["Enums"]["app_role"]
          specialty?: string | null
          teams_link?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          profile_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          profile_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      samarbeid_applications: {
        Row: {
          admin_note: string | null
          annual_revenue: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at: string
          id: string
          interest_type: string
          message: string | null
          num_employees: number | null
          org_number: string
          status: string
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_note?: string | null
          annual_revenue?: string | null
          company_name: string
          contact_email: string
          contact_name: string
          contact_phone: string
          created_at?: string
          id?: string
          interest_type?: string
          message?: string | null
          num_employees?: number | null
          org_number: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_note?: string | null
          annual_revenue?: string | null
          company_name?: string
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          created_at?: string
          id?: string
          interest_type?: string
          message?: string | null
          num_employees?: number | null
          org_number?: string
          status?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          active: boolean | null
          body_content: string | null
          category: string | null
          created_at: string
          cta_subtitle: string | null
          cta_title: string | null
          deliverables: string[] | null
          description: string | null
          group_name: string | null
          hero_image_url: string | null
          hero_subtitle: string | null
          hero_title: string | null
          href: string | null
          icon: string | null
          id: string
          meta_description: string | null
          meta_title: string | null
          related_services: Json | null
          section: string | null
          slug: string | null
          sort_order: number | null
          title: string
          updated_at: string
          why_items: Json | null
        }
        Insert: {
          active?: boolean | null
          body_content?: string | null
          category?: string | null
          created_at?: string
          cta_subtitle?: string | null
          cta_title?: string | null
          deliverables?: string[] | null
          description?: string | null
          group_name?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          related_services?: Json | null
          section?: string | null
          slug?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
          why_items?: Json | null
        }
        Update: {
          active?: boolean | null
          body_content?: string | null
          category?: string | null
          created_at?: string
          cta_subtitle?: string | null
          cta_title?: string | null
          deliverables?: string[] | null
          description?: string | null
          group_name?: string | null
          hero_image_url?: string | null
          hero_subtitle?: string | null
          hero_title?: string | null
          href?: string | null
          icon?: string | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          related_services?: Json | null
          section?: string | null
          slug?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
          why_items?: Json | null
        }
        Relationships: []
      }
      sms_campaign_contacts: {
        Row: {
          campaign_id: string
          contact_id: string | null
          id: string
          phone: string
        }
        Insert: {
          campaign_id: string
          contact_id?: string | null
          id?: string
          phone: string
        }
        Update: {
          campaign_id?: string
          contact_id?: string | null
          id?: string
          phone?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_campaign_contacts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sms_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_campaign_contacts_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "sms_contacts"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_campaigns: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          failed_count: number
          id: string
          message: string
          name: string
          scheduled_at: string | null
          sent_count: number
          status: string
          total_recipients: number
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          failed_count?: number
          id?: string
          message: string
          name: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          total_recipients?: number
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          failed_count?: number
          id?: string
          message?: string
          name?: string
          scheduled_at?: string | null
          sent_count?: number
          status?: string
          total_recipients?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_contact_group_members: {
        Row: {
          contact_id: string
          group_id: string
          id: string
        }
        Insert: {
          contact_id: string
          group_id: string
          id?: string
        }
        Update: {
          contact_id?: string
          group_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_contact_group_members_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "sms_contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_contact_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "sms_contact_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_contact_groups: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      sms_contacts: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
          tags: string[]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
          tags?: string[]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
          tags?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      sms_devices: {
        Row: {
          api_key: string
          created_at: string
          device_name: string
          id: string
          last_seen: string | null
          messages_sent_today: number
          phone_number: string
          status: string
          updated_at: string
        }
        Insert: {
          api_key?: string
          created_at?: string
          device_name: string
          id?: string
          last_seen?: string | null
          messages_sent_today?: number
          phone_number: string
          status?: string
          updated_at?: string
        }
        Update: {
          api_key?: string
          created_at?: string
          device_name?: string
          id?: string
          last_seen?: string | null
          messages_sent_today?: number
          phone_number?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      sms_messages: {
        Row: {
          campaign_id: string | null
          created_at: string
          delivered_at: string | null
          device_id: string | null
          error_message: string | null
          id: string
          message: string
          phone: string
          queued_at: string
          retry_count: number
          sent_at: string | null
          status: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          delivered_at?: string | null
          device_id?: string | null
          error_message?: string | null
          id?: string
          message: string
          phone: string
          queued_at?: string
          retry_count?: number
          sent_at?: string | null
          status?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          delivered_at?: string | null
          device_id?: string | null
          error_message?: string | null
          id?: string
          message?: string
          phone?: string
          queued_at?: string
          retry_count?: number
          sent_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sms_messages_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sms_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sms_messages_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "sms_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_settings: {
        Row: {
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      sms_templates: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      workspace_comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          emoji: string
          id: string
          profile_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          emoji?: string
          id?: string
          profile_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          emoji?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "workspace_post_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_comment_likes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_comment_replies: {
        Row: {
          author_id: string
          comment_id: string
          content: string
          created_at: string
          edited_at: string | null
          id: string
        }
        Insert: {
          author_id: string
          comment_id: string
          content: string
          created_at?: string
          edited_at?: string | null
          id?: string
        }
        Update: {
          author_id?: string
          comment_id?: string
          content?: string
          created_at?: string
          edited_at?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_comment_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_comment_replies_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "workspace_post_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_friends: {
        Row: {
          created_at: string
          id: string
          receiver_id: string
          requester_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          receiver_id: string
          requester_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          receiver_id?: string
          requester_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_friends_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_friends_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          profile_id: string
          role: string
          status: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          profile_id: string
          role?: string
          status?: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          profile_id?: string
          role?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "workspace_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_group_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_group_messages: {
        Row: {
          content: string
          created_at: string
          file_name: string | null
          file_url: string | null
          group_id: string
          id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          group_id: string
          id?: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          file_name?: string | null
          file_url?: string | null
          group_id?: string
          id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "workspace_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_group_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_groups: {
        Row: {
          avatar_url: string | null
          color: string | null
          cover_image_url: string | null
          cover_url: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_private: boolean
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          color?: string | null
          cover_image_url?: string | null
          cover_url?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          color?: string | null
          cover_image_url?: string | null
          cover_url?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_notifications: {
        Row: {
          actor_id: string
          body: string | null
          created_at: string
          id: string
          image_url: string | null
          read: boolean
          recipient_id: string
          reference_id: string | null
          reference_type: string | null
          title: string | null
          type: string
        }
        Insert: {
          actor_id: string
          body?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          read?: boolean
          recipient_id: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string | null
          type: string
        }
        Update: {
          actor_id?: string
          body?: string | null
          created_at?: string
          id?: string
          image_url?: string | null
          read?: boolean
          recipient_id?: string
          reference_id?: string | null
          reference_type?: string | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_notifications_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_post_comments: {
        Row: {
          author_id: string
          content: string
          created_at: string
          edited_at: string | null
          id: string
          post_id: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          edited_at?: string | null
          id?: string
          post_id: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_post_comments_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "workspace_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_post_reactions: {
        Row: {
          created_at: string
          emoji: string
          id: string
          post_id: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          emoji?: string
          id?: string
          post_id: string
          profile_id: string
        }
        Update: {
          created_at?: string
          emoji?: string
          id?: string
          post_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_post_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "workspace_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workspace_post_reactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string
          edited_at: string | null
          id: string
          image_url: string | null
          pinned: boolean
          title: string | null
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          edited_at?: string | null
          id?: string
          image_url?: string | null
          pinned?: boolean
          title?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          edited_at?: string | null
          id?: string
          image_url?: string | null
          pinned?: boolean
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_profile_id: { Args: { uid?: string }; Returns: string }
      customer_can_read_advisor: {
        Args: { _advisor_profile_id: string; uid?: string }
        Returns: boolean
      }
      get_advisor_unavailability: {
        Args: { _advisor_ids: string[] }
        Returns: {
          blocked_date: string
          booking_date: string
          booking_time: string
          profile_id: string
        }[]
      }
      is_admin: { Args: { uid?: string }; Returns: boolean }
      is_customer: { Args: { uid?: string }; Returns: boolean }
      is_dm_participant: {
        Args: { _conversation_id: string; uid?: string }
        Returns: boolean
      }
      is_employee_or_admin: { Args: { uid?: string }; Returns: boolean }
      list_public_advisors: {
        Args: never
        Returns: {
          id: string
          name: string
        }[]
      }
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
