import { useState, useEffect } from "react";
import { authApi} from "../lib/api";
import type { AdminLoginResponse } from "../lib/api";

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



/**
 * Define la estructura del objeto de usuario administrador
 */
interface AdminUser {
  id: number;
  nickname: string;
  email: string;
  role: "admin" | "super_admin";
}

/**
* Custom hook para gestionar el estado de autenticación del panel de administración.
*/
export function useAuthAdmin() {
  const [isAuthenticatedAdmin, setIsAuthenticatedAdmin] = useState(false);
  const [isLoadingAdmin, setIsLoadingAdmin] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
      checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
      setIsLoadingAdmin(true);
      try {
          // Suponemos que existe authApi.getAdminProfile() (usando el endpoint /api/auth/admin/profile)
          const response: AdminLoginResponse = await authApi.getAdminProfile(); 
          
          setAdminUser({
              id: response.user.id,
              nickname: response.user.nickname,
              email: response.user.email,
              role: response.user.role,
          });
          setIsAuthenticatedAdmin(true);
      } catch (error) {
          setIsAuthenticatedAdmin(false);
          setAdminUser(null);
      } finally {
          setIsLoadingAdmin(false);
      }
  };
  
  /**
   * ⭐ Cierra la sesión del administrador usando el endpoint genérico /api/auth/logout.
   * Luego, fuerza una re-verificación para actualizar el estado.
   */
  const adminLogout = async () => {
      try {
          // Usamos el endpoint genérico de logout, el backend se encargará de la cookie de admin
          await authApi.logout(); 
      } catch (error) {
          console.error("Error al cerrar sesión de administrador (API):", error);
          // El error es manejado en el frontend forzando el estado a no autenticado
      } finally {
          // Forzamos la re-verificación para actualizar el estado del hook
          await checkAdminAuth(); 
      }
  };

  return {
      isAuthenticatedAdmin,
      isLoadingAdmin,
      adminUser,
      adminRole: adminUser?.role,
      checkAdminAuth,
      adminLogout, // Incluimos la función de logout para su uso en la UI
  };
}