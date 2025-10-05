// @types/index.ts ou onde sua interface User estiver definida
export interface User {
  id: number;
  name: string;
  email: string;
  teamMembers: TeamMember[]
}

export interface Team {
  id: number;
  name: string;
  teamMembers: TeamMember[]
}

export interface TeamMember {
  id: number;
  userId: number;
  teamId: number;
}

export interface Property {
  id: number;
  title: string;
  price: string | number;
  latitude: number;
  longitude: number;
  category: string;
  userId: number;
  teamId?: number;
  images: { url: string }[];
  description: string;
  description1?: string;
  user_id?: number;
  team_id?: number;
  created_at?: string;
  updated_at?: string;
}
