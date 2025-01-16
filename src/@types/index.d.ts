export interface User {
    id: number;
    username: string; 
  }
  
  export interface Property {
    id: number;
    titulo: string;
    descricao: string;
    valor: number;
    latitude: number;
    longitude: number;
    imagens: { url: string }[]; 
  }