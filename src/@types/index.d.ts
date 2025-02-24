// @types/index.ts ou onde sua interface User estiver definida
export interface User {
  id: number;
  name: string;
  email: string;
  team?: Team; // A propriedade team é opcional, pois nem todo usuário pode ter um time
}

export interface Team {
  id: number;
  name: string;
  members: User[];
}

export interface Property {
  id: number;
  title: string;
  price: string | number;
  latitude: number;
  longitude: number;
  category: string;
  userId: number;
  teamId: number;
  images: { url: string }[];
}
