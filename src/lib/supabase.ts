import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não configuradas!')
  console.error('📝 Verifique se o arquivo .env existe e contém:')
  console.error('   VITE_SUPABASE_URL=sua_url_aqui')
  console.error('   VITE_SUPABASE_ANON_KEY=sua_chave_aqui')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          username: string
          picture?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          username: string
          picture?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          username?: string
          picture?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: number
          title: string
          description: string
          description1?: string
          price: string
          category: string
          latitude: number
          longitude: number
          user_id: string
          team_id?: number
          images: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          description1?: string
          price: string
          category: string
          latitude: number
          longitude: number
          user_id: string
          team_id?: number
          images?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          description1?: string
          price?: string
          category?: string
          latitude?: number
          longitude?: number
          user_id?: string
          team_id?: number
          images?: string[]
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: number
          name: string
          image_url?: string
          creator_id: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          image_url?: string
          creator_id: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          image_url?: string
          creator_id?: number
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: number
          user_id: number
          team_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: number
          team_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: number
          team_id?: number
        }
      }
      team_invitations: {
        Row: {
          id: number
          team_id: number
          user_id: number
          status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          created_at: string
        }
        Insert: {
          id?: number
          team_id: number
          user_id: number
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
          created_at?: string
        }
        Update: {
          id?: number
          team_id?: number
          user_id?: number
          status?: 'PENDING' | 'ACCEPTED' | 'REJECTED'
        }
      }
      messages: {
        Row: {
          id: number
          sender_id: number
          receiver_id: number
          content: string
          created_at: string
          read_at?: string
        }
        Insert: {
          id?: number
          sender_id: number
          receiver_id: number
          content: string
          created_at?: string
          read_at?: string
        }
        Update: {
          id?: number
          sender_id?: number
          receiver_id?: number
          content?: string
          read_at?: string
        }
      }
    }
  }
}
