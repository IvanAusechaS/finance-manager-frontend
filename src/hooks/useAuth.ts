import { useState, useEffect } from "react";
import { authApi } from "../lib/api";

/**
 * Custom hook to manage authentication state
 * Checks if user is authenticated by verifying the session
 */
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: number;
    nickname: string;
    email: string;
  } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Intentar obtener el perfil del usuario
      const response = await authApi.getProfile();
      setUser(response.user);
      setIsAuthenticated(true);
    } catch {
      // Si falla, el usuario no está autenticado
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    logout,
    checkAuth,
  };
}
