export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      breed_types: {
        Row: {
          id: number
          type: string
        }
        Insert: {
          id?: number
          type: string
        }
        Update: {
          id?: number
          type?: string
        }
        Relationships: []
      }
      breeds: {
        Row: {
          created_at: string | null
          id: number
          name: string
          type: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          type?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "breeds_type_fkey"
            columns: ["type"]
            isOneToOne: false
            referencedRelation: "breed_types"
            referencedColumns: ["id"]
          },
        ]
      }
      consent_form: {
        Row: {
          consent_form_url: string
          created_at: string
          id: number
          pet_id: string
        }
        Insert: {
          consent_form_url: string
          created_at?: string
          id?: number
          pet_id: string
        }
        Update: {
          consent_form_url?: string
          created_at?: string
          id?: number
          pet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "consent_form_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["uuid"]
          },
        ]
      }
      images: {
        Row: {
          created_at: string | null
          pet_id: number | null
          url: string
          uuid: string
        }
        Insert: {
          created_at?: string | null
          pet_id?: number | null
          url: string
          uuid?: string
        }
        Update: {
          created_at?: string | null
          pet_id?: number | null
          url?: string
          uuid?: string
        }
        Relationships: []
      }
      pets: {
        Row: {
          birth: string | null
          bite: boolean | null
          breed_id: number | null
          created_at: string | null
          heart_disease: boolean | null
          memo: string | null
          name: string | null
          neutering: boolean | null
          reg_number: string | null
          sex: string | null
          underlying_disease: string | null
          user_id: string | null
          uuid: string
          weight: number | null
        }
        Insert: {
          birth?: string | null
          bite?: boolean | null
          breed_id?: number | null
          created_at?: string | null
          heart_disease?: boolean | null
          memo?: string | null
          name?: string | null
          neutering?: boolean | null
          reg_number?: string | null
          sex?: string | null
          underlying_disease?: string | null
          user_id?: string | null
          uuid?: string
          weight?: number | null
        }
        Update: {
          birth?: string | null
          bite?: boolean | null
          breed_id?: number | null
          created_at?: string | null
          heart_disease?: boolean | null
          memo?: string | null
          name?: string | null
          neutering?: boolean | null
          reg_number?: string | null
          sex?: string | null
          underlying_disease?: string | null
          user_id?: string | null
          uuid?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pets_breed_id_fkey"
            columns: ["breed_id"]
            isOneToOne: false
            referencedRelation: "breeds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["uuid"]
          },
        ]
      }
      reservations: {
        Row: {
          additional_price: number | null
          additional_services: string | null
          created_at: string | null
          memo: string | null
          pet_id: string
          reservation_date: string
          service_name: string
          status: string
          total_price: number
          uuid: string
        }
        Insert: {
          additional_price?: number | null
          additional_services?: string | null
          created_at?: string | null
          memo?: string | null
          pet_id: string
          reservation_date: string
          service_name: string
          status: string
          total_price: number
          uuid?: string
        }
        Update: {
          additional_price?: number | null
          additional_services?: string | null
          created_at?: string | null
          memo?: string | null
          pet_id?: string
          reservation_date?: string
          service_name?: string
          status?: string
          total_price?: number
          uuid?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["uuid"]
          },
        ]
      }
      service_option_category: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      service_option_group: {
        Row: {
          id: number
          service_option_id: number | null
          services_name_id: number | null
        }
        Insert: {
          id: number
          service_option_id?: number | null
          services_name_id?: number | null
        }
        Update: {
          id?: number
          service_option_id?: number | null
          services_name_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_option_group_service_option_id_fkey"
            columns: ["service_option_id"]
            isOneToOne: false
            referencedRelation: "service_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_option_group_services_name_id_fkey"
            columns: ["services_name_id"]
            isOneToOne: false
            referencedRelation: "services_names"
            referencedColumns: ["id"]
          },
        ]
      }
      service_options: {
        Row: {
          category_id: number
          created_at: string
          id: number
          name: string
          price: number
        }
        Insert: {
          category_id: number
          created_at?: string
          id?: number
          name: string
          price: number
        }
        Update: {
          category_id?: number
          created_at?: string
          id?: number
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_options_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_option_category"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          breed_type: number | null
          created_at: string | null
          id: number
          price: number
          service_name_id: number | null
          weight_range: number | null
        }
        Insert: {
          breed_type?: number | null
          created_at?: string | null
          id?: number
          price: number
          service_name_id?: number | null
          weight_range?: number | null
        }
        Update: {
          breed_type?: number | null
          created_at?: string | null
          id?: number
          price?: number
          service_name_id?: number | null
          weight_range?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "services_breed_type_fkey"
            columns: ["breed_type"]
            isOneToOne: false
            referencedRelation: "breed_types"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_service_name_id_fkey"
            columns: ["service_name_id"]
            isOneToOne: false
            referencedRelation: "services_names"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_weight_range_fkey"
            columns: ["weight_range"]
            isOneToOne: false
            referencedRelation: "weight_ranges"
            referencedColumns: ["id"]
          },
        ]
      }
      services_names: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      user: {
        Row: {
          address: string | null
          created_at: string
          detail_address: string | null
          name: string | null
          phone: string
          uuid: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          detail_address?: string | null
          name?: string | null
          phone: string
          uuid?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          detail_address?: string | null
          name?: string | null
          phone?: string
          uuid?: string
        }
        Relationships: []
      }
      weight_ranges: {
        Row: {
          id: number
          weight_range: number
        }
        Insert: {
          id?: number
          weight_range: number
        }
        Update: {
          id?: number
          weight_range?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
