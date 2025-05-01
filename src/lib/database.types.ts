export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      venues: {
        Row: {
          id: string
          name: string
          address: string
          city: string
          state: string
          pin_code: string
          capacity: number
          description: string
          contact_person: string
          contact_phone: string
          contact_email: string
          images: string[]
          amenities: string[]
          price_per_day: number
          available_from: string
          available_until: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Insert: {
          id?: string
          name: string
          address: string
          city: string
          state: string
          pin_code: string
          capacity: number
          description: string
          contact_person: string
          contact_phone: string
          contact_email: string
          images: string[]
          amenities: string[]
          price_per_day: number
          available_from: string
          available_until: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          pin_code?: string
          capacity?: number
          description?: string
          contact_person?: string
          contact_phone?: string
          contact_email?: string
          images?: string[]
          amenities?: string[]
          price_per_day?: number
          available_from?: string
          available_until?: string
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
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
  }
} 