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
      contaminants: {
        Row: {
          contexts: string[] | null
          epaPdfUrl: string | null
          id: string
          name: string
          nameraw: string
          siteCount: number | null
          summary: string | null
          wikipediaUrl: string | null
        }
        Insert: {
          contexts?: string[] | null
          epaPdfUrl?: string | null
          id: string
          name: string
          nameraw: string
          siteCount?: number | null
          summary?: string | null
          wikipediaUrl?: string | null
        }
        Update: {
          contexts?: string[] | null
          epaPdfUrl?: string | null
          id?: string
          name?: string
          nameraw?: string
          siteCount?: number | null
          summary?: string | null
          wikipediaUrl?: string | null
        }
        Relationships: []
      }
      images: {
        Row: {
          alt: string | null
          blurhash: string | null
          caption: string | null
          contaminantId: string | null
          height: number | null
          id: string
          siteId: string | null
          source: string | null
          url: string
          width: number | null
        }
        Insert: {
          alt?: string | null
          blurhash?: string | null
          caption?: string | null
          contaminantId?: string | null
          height?: number | null
          id?: string
          siteId?: string | null
          source?: string | null
          url: string
          width?: number | null
        }
        Update: {
          alt?: string | null
          blurhash?: string | null
          caption?: string | null
          contaminantId?: string | null
          height?: number | null
          id?: string
          siteId?: string | null
          source?: string | null
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "images_contaminantId_fkey"
            columns: ["contaminantId"]
            isOneToOne: false
            referencedRelation: "contaminants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "images_siteId_fkey"
            columns: ["siteId"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      scores: {
        Row: {
          addressCity: string | null
          addressFormatted: string | null
          addressRaw: string | null
          addressStateCode: string | null
          createdAt: string
          id: string
          lat: number | null
          lng: number | null
          siteNearest: string | null
          siteNearestMiles: number | null
          sites1: string[] | null
          sites10: string[] | null
          sites20: string[] | null
          sites5: string[] | null
          sites50: string[] | null
        }
        Insert: {
          addressCity?: string | null
          addressFormatted?: string | null
          addressRaw?: string | null
          addressStateCode?: string | null
          createdAt?: string
          id?: string
          lat?: number | null
          lng?: number | null
          siteNearest?: string | null
          siteNearestMiles?: number | null
          sites1?: string[] | null
          sites10?: string[] | null
          sites20?: string[] | null
          sites5?: string[] | null
          sites50?: string[] | null
        }
        Update: {
          addressCity?: string | null
          addressFormatted?: string | null
          addressRaw?: string | null
          addressStateCode?: string | null
          createdAt?: string
          id?: string
          lat?: number | null
          lng?: number | null
          siteNearest?: string | null
          siteNearestMiles?: number | null
          sites1?: string[] | null
          sites10?: string[] | null
          sites20?: string[] | null
          sites5?: string[] | null
          sites50?: string[] | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          acres: number | null
          category: Database["public"]["Enums"]["Category"] | null
          city: string | null
          contactEmail: string | null
          contactName: string | null
          contactPhone: string | null
          contaminants: Json | null
          county: string | null
          dateCompleted: string | null
          dateDeleted: string | null
          dateListed: string | null
          dateNOID: string | null
          dateProposed: string | null
          epaUrl: string | null
          geometry: Json | null
          id: string
          lat: number | null
          lng: number | null
          mapboxNearby: Json[] | null
          name: string | null
          npl: string | null
          semsId: string | null
          stateCode: string | null
          stateName: string | null
          summary: string | null
        }
        Insert: {
          acres?: number | null
          category?: Database["public"]["Enums"]["Category"] | null
          city?: string | null
          contactEmail?: string | null
          contactName?: string | null
          contactPhone?: string | null
          contaminants?: Json | null
          county?: string | null
          dateCompleted?: string | null
          dateDeleted?: string | null
          dateListed?: string | null
          dateNOID?: string | null
          dateProposed?: string | null
          epaUrl?: string | null
          geometry?: Json | null
          id: string
          lat?: number | null
          lng?: number | null
          mapboxNearby?: Json[] | null
          name?: string | null
          npl?: string | null
          semsId?: string | null
          stateCode?: string | null
          stateName?: string | null
          summary?: string | null
        }
        Update: {
          acres?: number | null
          category?: Database["public"]["Enums"]["Category"] | null
          city?: string | null
          contactEmail?: string | null
          contactName?: string | null
          contactPhone?: string | null
          contaminants?: Json | null
          county?: string | null
          dateCompleted?: string | null
          dateDeleted?: string | null
          dateListed?: string | null
          dateNOID?: string | null
          dateProposed?: string | null
          epaUrl?: string | null
          geometry?: Json | null
          id?: string
          lat?: number | null
          lng?: number | null
          mapboxNearby?: Json[] | null
          name?: string | null
          npl?: string | null
          semsId?: string | null
          stateCode?: string | null
          stateName?: string | null
          summary?: string | null
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
      Category:
        | "military"
        | "mining"
        | "fuel"
        | "dryclean"
        | "chemical"
        | "manufacturing"
        | "metal"
        | "wood"
        | "tech"
        | "water"
        | "waste"
        | "radioactive"
        | "other"
        | "unknown"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Category: [
        "military",
        "mining",
        "fuel",
        "dryclean",
        "chemical",
        "manufacturing",
        "metal",
        "wood",
        "tech",
        "water",
        "waste",
        "radioactive",
        "other",
        "unknown",
      ],
    },
  },
} as const
