import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ArrowLeft, LogIn, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { authApi } from "../lib/api";

export function NotFoundPage() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    console.log("🔍 [NotFoundPage] Verificando autenticación");
    const checkAuth = async () => {
      try {
        await authApi.getProfile();
        console.log("✅ [NotFoundPage] Usuario autenticado");
        setIsAuthenticated(true);
      } catch {
        console.log("❌ [NotFoundPage] Usuario no autenticado");
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  const handleMainAction = () => {
    console.log(
      "🔄 [NotFoundPage] Redirigiendo a:",
      isAuthenticated ? "/dashboard" : "/login"
    );
    navigate(isAuthenticated ? "/dashboard" : "/login");
  };

  return (
    <div className="min-h-screen py-12 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-9xl font-bold text-indigo-600">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800">
              Página no encontrada
            </h2>
            <p className="text-gray-600">
              Lo sentimos, la página que buscas no existe o ha sido movida.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => {
                console.log("⬅️ [NotFoundPage] Regresando a página anterior");
                navigate(-1);
              }}
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Regresar
            </Button>
            {isAuthenticated !== null && (
              <Button
                onClick={handleMainAction}
                className="flex items-center gap-2"
              >
                {isAuthenticated ? (
                  <>
                    <LayoutDashboard className="w-4 h-4" />
                    Ir al Dashboard
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            )}
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-500">
              Si crees que esto es un error, por favor contacta al soporte.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
