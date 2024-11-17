export interface User {
    id: number;
    username: string; 
  }
  
  export interface Imovel {
    id: number;
    titulo: string;
    descricao: string;
    valor: number;
    latitude: number;
    longitude: number;
    imagens: { url: string }[]; 
  }