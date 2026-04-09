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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      agentes: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          last_seen: string | null
          nome: string
          sede_id: string
          sistema_operacional: string
          token: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          last_seen?: string | null
          nome: string
          sede_id: string
          sistema_operacional?: string
          token?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          last_seen?: string | null
          nome?: string
          sede_id?: string
          sistema_operacional?: string
          token?: string
        }
        Relationships: [
          {
            foreignKeyName: "agentes_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      estoque_toners: {
        Row: {
          cor: string
          created_at: string
          id: string
          impressora_compativel: string
          modelo: string
          quantidade: number
          quantidade_minima: number
          sede_id: string
          updated_at: string
        }
        Insert: {
          cor: string
          created_at?: string
          id?: string
          impressora_compativel: string
          modelo: string
          quantidade?: number
          quantidade_minima?: number
          sede_id: string
          updated_at?: string
        }
        Update: {
          cor?: string
          created_at?: string
          id?: string
          impressora_compativel?: string
          modelo?: string
          quantidade?: number
          quantidade_minima?: number
          sede_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estoque_toners_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          cor: string | null
          descricao: string
          id: string
          impressora_id: string
          resolvido: boolean
          timestamp: string
          tipo: string
        }
        Insert: {
          cor?: string | null
          descricao: string
          id?: string
          impressora_id: string
          resolvido?: boolean
          timestamp?: string
          tipo: string
        }
        Update: {
          cor?: string | null
          descricao?: string
          id?: string
          impressora_id?: string
          resolvido?: boolean
          timestamp?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "eventos_impressora_id_fkey"
            columns: ["impressora_id"]
            isOneToOne: false
            referencedRelation: "impressoras"
            referencedColumns: ["id"]
          },
        ]
      }
      impressoras: {
        Row: {
          created_at: string
          id: string
          ip: string
          last_seen: string | null
          mac_address: string | null
          modelo: string | null
          nome: string
          page_count: number
          patrimonio: string | null
          sede_id: string
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip: string
          last_seen?: string | null
          mac_address?: string | null
          modelo?: string | null
          nome: string
          page_count?: number
          patrimonio?: string | null
          sede_id: string
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip?: string
          last_seen?: string | null
          mac_address?: string | null
          modelo?: string | null
          nome?: string
          page_count?: number
          patrimonio?: string | null
          sede_id?: string
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "impressoras_sede_id_fkey"
            columns: ["sede_id"]
            isOneToOne: false
            referencedRelation: "sedes"
            referencedColumns: ["id"]
          },
        ]
      }
      leituras: {
        Row: {
          id: string
          impressora_id: string
          page_count: number
          status: string
          timestamp: string
        }
        Insert: {
          id?: string
          impressora_id: string
          page_count: number
          status: string
          timestamp?: string
        }
        Update: {
          id?: string
          impressora_id?: string
          page_count?: number
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "leituras_impressora_id_fkey"
            columns: ["impressora_id"]
            isOneToOne: false
            referencedRelation: "impressoras"
            referencedColumns: ["id"]
          },
        ]
      }
      leituras_toner: {
        Row: {
          cor: string
          id: string
          impressora_id: string
          nivel: number
          timestamp: string
        }
        Insert: {
          cor: string
          id?: string
          impressora_id: string
          nivel: number
          timestamp?: string
        }
        Update: {
          cor?: string
          id?: string
          impressora_id?: string
          nivel?: number
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "leituras_toner_impressora_id_fkey"
            columns: ["impressora_id"]
            isOneToOne: false
            referencedRelation: "impressoras"
            referencedColumns: ["id"]
          },
        ]
      }
      sedes: {
        Row: {
          created_at: string
          id: string
          network_range: string | null
          nome: string
        }
        Insert: {
          created_at?: string
          id?: string
          network_range?: string | null
          nome: string
        }
        Update: {
          created_at?: string
          id?: string
          network_range?: string | null
          nome?: string
        }
        Relationships: []
      }
      toners: {
        Row: {
          cor: string
          id: string
          impressora_id: string
          nivel_atual: number
          updated_at: string
        }
        Insert: {
          cor: string
          id?: string
          impressora_id: string
          nivel_atual?: number
          updated_at?: string
        }
        Update: {
          cor?: string
          id?: string
          impressora_id?: string
          nivel_atual?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "toners_impressora_id_fkey"
            columns: ["impressora_id"]
            isOneToOne: false
            referencedRelation: "impressoras"
            referencedColumns: ["id"]
          },
        ]
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
    Enums: {},
  },
} as const
