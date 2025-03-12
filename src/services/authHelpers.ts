// src/services/authHelpers.ts

export const fetchTeamById = async (teamId: number) => {
    try {
      console.log(`Buscando equipe com ID: ${teamId}`);
      const response = await fetch(`/api/teams/${teamId}`);
      const teamData = await response.json();
      console.log(`Equipe encontrada:`, teamData);
      return teamData;
    } catch (error) {
      console.error("Erro ao buscar equipe:", error);
      throw new Error("Erro ao buscar equipe");
    }
  };
  