// src/services/authService.tsx

export const loginService = async (username: string, password: string) => {
    try {
      const response = await fetch("https://server-2-production.up.railway.app/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro no login");
      }
  
      const data = await response.json();
      return data.user; 
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };
  
  export const logoutService = () => {
    localStorage.removeItem('user');
  };
  