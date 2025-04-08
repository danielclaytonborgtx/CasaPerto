export interface Team {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  teamMember: { teamId: number; team: Team }[];
}

export interface Property {
  id: number;
  title: string;
  price: string;
  latitude: number;
  longitude: number;
  category: string;
  images: { url: string }[];
  userId: number;
  user: User;
  teamId?: number;
} 