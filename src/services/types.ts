// types.ts
export interface TeamMember {
    id: number;
    userId: number;
    teamId: number;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    password: string;
    picture?: string;
    createdAt: string;
    updatedAt: string;
    teamMembers?: TeamMember[];
  }
  
  export interface Team {
    id: number;
    name: string;
    teamMembers: TeamMember[];
  }
  
  export interface AuthContextType {
    user: User | null;
    team: Team | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    createTeam: (teamData: Team) => void;
    setUser: (user: User | null) => void;
    updateTeamId: (teamId: number) => void;
  }