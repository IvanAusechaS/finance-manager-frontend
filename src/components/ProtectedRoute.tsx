import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authApi } from "../lib/api";
import { toast } from "sonner";

interface ProtectedRouteProps {
  readonly children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await authApi.getProfile();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
        // Mostrar notificación solo si no estamos ya en login o registro
        // y si no venimos de una redirección desde login
        const fromLogin = sessionStorage.getItem("justLoggedIn");
        if (fromLogin) {
          sessionStorage.removeItem("justLoggedIn");
          // Dar más tiempo para que las cookies se establezcan
          await new Promise((resolve) => setTimeout(resolve, 300));
          // Reintentar la verificación
          try {
            await authApi.getProfile();
            setIsAuthenticated(true);
            return;
          } catch {
            // Si aún falla, continuar con el flujo normal
          }
        }

        if (
          location.pathname !== "/login" &&
          location.pathname !== "/register"
        ) {
          toast.error("Debes iniciar sesión para acceder a esta página", {
            description: "Por favor, inicia sesión o regístrate para continuar",
            duration: 4000,
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Guardar la ruta a la que intentaba acceder para redirigir después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
