// src/pages/AdminLoginPage.tsx

import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Shield, // Nuevo icono para administración
} from "lucide-react";
import { Footer } from "../components/Footer";
import { toast } from "../utils/toast";
import { validateEmail, validateRequired } from "../lib/validations";
import { authApi } from "../lib/api";
import type { ApiError } from "../lib/api";

export function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ... (El estado de errores y touched es idéntico a LoginPage.tsx)
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  // ... (Las funciones validateField, handleChange y handleBlur son idénticas a LoginPage.tsx)
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case "email":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        if (!validateEmail(value)) {
          return "Formato de correo inválido";
        }
        return "";

      case "password":
        if (!validateRequired(value)) {
          return "Este campo es requerido";
        }
        return "";

      default:
        return "";
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  /**
   * Manejador del Submit
   * Llama a authApi.adminLogin y redirige al panel de administración.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      email: true,
      password: true,
    });

    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    setIsLoading(true);

    try {
      // 🚨 CAMBIO CLAVE 1: Usar el endpoint de Admin
      const response = await authApi.adminLogin({
        email: formData.email,
        password: formData.password,
      });

      // Aseguramos que el rol es visible en la notificación
      const roleName = response.user.role === 'super_admin' ? 'Súper Admin' : 'Admin';

      toast.success(`¡Bienvenido, ${roleName} ${response.user.nickname}!`, {
        description: "Has iniciado sesión en el panel de administración",
        icon: <CheckCircle2 />,
      });

      sessionStorage.setItem("justLoggedIn", "true");

      await new Promise((resolve) => setTimeout(resolve, 500));

      // 🚨 CAMBIO CLAVE 2: Redirección al Dashboard de Admin
      window.location.href = "/admin/dashboard";

    } catch (error) {
      const apiError = error as ApiError;

      // 403: Acceso restringido a administradores (Rol normal intentando login admin)
      if (apiError.statusCode === 403) {
        toast.error("Acceso no autorizado", {
          description: "Solo usuarios con rol de administrador pueden acceder a este panel.",
        });
      } else if (apiError.statusCode === 401) {
        toast.error("Credenciales inválidas", {
          description: "Correo o contraseña incorrectos",
        });
        setErrors({
          email: "Verifica tus credenciales",
          password: "",
        });
      } else if (apiError.statusCode === 429) {
        toast.error("Demasiados intentos", {
          description:
            "Por favor, espera unos minutos antes de intentar nuevamente",
        });
      } else if (apiError.statusCode === 0) {
        toast.error("Error de conexión", {
          description: apiError.message,
        });
      } else {
        toast.error("Error al iniciar sesión", {
          description: "Por favor, intenta de nuevo más tarde",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  console.log("🛡️ [AdminLoginPage] Componente montado");

  return (
    <>
      <Navbar />
      <section className="min-h-screen px-4 py-12 bg-gradient-to-br from-slate-50 via-red-50 to-slate-50 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda - Formulario de Login Admin */}
            <div>
              <Card className="border-red-300 shadow-xl"> {/* Estilo visual distinto */}
                <CardHeader className="space-y-1">
                  {/* 🚨 CAMBIO CLAVE 3: Título de Admin */}
                  <CardTitle className="text-red-700 flex items-center gap-2">
                    <Shield className="w-6 h-6" /> Acceso de Administrador
                  </CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales de administrador para acceder al panel
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... (Tus campos de email y password son idénticos) ... */}
                    {/* Sección Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-slate-700">
                        Correo electrónico
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="admin@tuempresa.com"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`pl-10 ${errors.email && touched.email
                              ? "border-red-500"
                              : ""
                            }`}
                          required
                        />
                        {errors.email && touched.email && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Sección Contraseña */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-slate-700">
                        Contraseña
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          id="password"
                          name="password"
                          type="password"
                          placeholder="Tu contraseña secreta"
                          value={formData.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`pl-10 ${errors.password && touched.password
                              ? "border-red-500"
                              : ""
                            }`}
                          required
                        />
                        {errors.password && touched.password && (
                          <p className="text-sm text-red-500 mt-1">
                            {errors.password}
                          </p>
                        )}
                      </div>
                    </div>
                    {/* ... (Fin de campos) ... */}

                    <div className="flex items-center justify-end pt-2">
                      {/* Quitamos "Recordarme" y "Olvidaste contraseña" para simplificar el login de admin */}
                      <Link
                        to="/forgot-password"
                        className="text-sm text-red-600 hover:underline"
                      >
                        ¿Problemas de acceso?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2 bg-red-600 hover:bg-red-700"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Accediendo al Panel...
                        </>
                      ) : (
                        <>
                          Acceder como Admin
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    {/* Enlace para volver al login de usuario normal */}
                    <div className="text-center text-sm text-slate-600 pt-4">
                      ¿No eres administrador?{" "}
                      <Link
                        to="/login"
                        className="text-blue-600 hover:underline"
                      >
                        Volver al Login de Usuario
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Columna derecha - Información (Ajustada) */}
            {/* ... (Ajustar textos y colores para que encajen con la estética de admin) ... */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full border border-red-200">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Panel de Control</span>
              </div>

              <div>
                <h1 className="text-slate-900 mb-4">
                  Acceso Restringido al Sistema
                </h1>
                <p className="text-slate-600 text-lg">
                  Solo personal autorizado puede ingresar a esta área para gestionar usuarios, logs y estadísticas de la plataforma.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🔒</span>
                  </div>
                  <div>
                    <div className="text-slate-900 mb-1">
                      Privacidad y Seguridad
                    </div>
                    <p className="text-slate-600 text-sm">
                      Tu acceso será registrado en el sistema de logs de sesiones.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-red-600 to-red-700 rounded-xl text-white">
                <div>
                  <div className="mb-1">Roles</div>
                  <div className="text-xs text-red-100">Admin/Super Admin</div>
                </div>
                <div>
                  <div className="mb-1">Acceso</div>
                  <div className="text-xs text-red-100">Logs y Gestión</div>
                </div>
                <div>
                  <div className="mb-1">Protección</div>
                  <div className="text-xs text-red-100">Verificar Token</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}