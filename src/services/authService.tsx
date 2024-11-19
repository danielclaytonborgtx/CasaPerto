// src/services/authService.tsx

export const loginService = async (email: string, password: string) => {
    try {
      const response = await fetch("https://casa-mais-perto-server-clone-production.up.railway.app/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      if (!response.ok) {
        throw new Error("Erro no login");
      }
  
      const data = await response.json();
      return data.user;  // Retorna os dados do usuário após o login
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };
  
  export const logoutService = () => {
    localStorage.removeItem('user');
  };
  