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
      projects: {
        Row: {
          id: string
          name: string
          description: string
          status: 'active' | 'completed' | 'archived'
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          status?: 'active' | 'completed' | 'archived'
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          context: string
          status: 'todo' | 'in_progress' | 'completed'
          order: number
          reference_image_url: string | null
          completion_notes: string | null
          created_at: string
          updated_at: string
          project_id: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          context: string
          status?: 'todo' | 'in_progress' | 'completed'
          order?: number
          reference_image_url?: string | null
          completion_notes?: string | null
          created_at?: string
          updated_at?: string
          project_id: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          context?: string
          status?: 'todo' | 'in_progress' | 'completed'
          order?: number
          reference_image_url?: string | null
          completion_notes?: string | null
          created_at?: string
          updated_at?: string
          project_id?: string
          user_id?: string
        }
      }
    }
    Storage: {
      Buckets: {
        'task-assets': {
          Row: {
            name: string
            owner: string
            created_at: string
            updated_at: string
            bucket_id: string
          }
        }
      }
    }
  }
}