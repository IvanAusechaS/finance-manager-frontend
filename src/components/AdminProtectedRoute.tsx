import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
// Asegúrate de que esta API devuelva el rol del usuario
import { authApi } from "../lib/api"; 
import { toast } from "sonner";
import type { UserWithRole } from "../lib/api"; // Type for user with role information

interface AdminProtectedRouteProps {
  readonly children: React.ReactNode;
}

const REQUIRED_ROLES = new Set(['admin', 'super_admin']); // Roles que pueden acceder al panel

export function AdminProtectedRoute({ children }: Readonly<AdminProtectedRouteProps>) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        // 1. Verificar autenticación y obtener perfil
        const profileResponse: { user: UserWithRole } = await authApi.getProfile(); 
        
        // 2. Verificar rol
        const userRole = profileResponse.user.role?.name; // Asume que el rol viene aquí
        
        if (userRole && REQUIRED_ROLES.has(userRole)) {
          setHasPermission(true);
        } else {
          // Usuario autenticado, pero sin el rol correcto
          console.warn(`Intento de acceso denegado. Rol: ${userRole}`);
          setHasPermission(false);
          toast.error("Acceso Denegado", {
            description: "No tienes permisos de administrador para acceder a esta sección.",
            duration: 4000,
          });
        }
      } catch {
        // Falló la autenticación (no logueado)
        setHasPermission(false);
        // Opcional: Mostrar error genérico de login si no viene de login-admin
        if (location.pathname !== "/admin-login") {
           toast.error("Debes iniciar sesión como administrador.", { duration: 4000 });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAuth();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    // Si no tiene permiso, redirigir a la página de login de administrador
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}