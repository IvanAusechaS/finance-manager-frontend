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
import { Checkbox } from "../components/ui/checkbox";
import {
  Wallet,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { toast } from "../utils/toast";
import { validateEmail, validateRequired } from "../lib/validations";
import { authApi } from "../lib/api";
import type { ApiError } from "../lib/api";

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);

  // Estado de los errores
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  // Estado de campos tocados
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  /**
   * Validación en tiempo real de cada campo
   */
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

  /**
   * Maneja el cambio en los campos del formulario
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar solo si el campo ya fue tocado
    if (touched[name as keyof typeof touched]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  /**
   * Marca el campo como tocado al perder el foco
   */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Marcar todos los campos como tocados
    setTouched({
      email: true,
      password: true,
    });

    // Validar todos los campos
    const newErrors = {
      email: validateField("email", formData.email),
      password: validateField("password", formData.password),
    };

    setErrors(newErrors);

    // Si hay errores, no continuar
    if (Object.values(newErrors).some((error) => error !== "")) {
      return;
    }

    setIsLoading(true);

    try {
      // Llamada al backend
      const response = await authApi.login({
        email: formData.email,
        password: formData.password,
      });

      toast.success(`¡Hola, ${response.user.nickname}!`, {
        description: "Has iniciado sesión correctamente",
        icon: <CheckCircle2 />,
      });

      // Marcar que acabamos de hacer login para evitar verificaciones prematuras
      sessionStorage.setItem("justLoggedIn", "true");

      // Pausa para asegurar que las cookies se establezcan correctamente
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Forzar recarga para asegurar que las cookies estén disponibles
      globalThis.location.href = "/dashboard";
    } catch (error) {
      // Manejo de errores del servidor
      const apiError = error as ApiError;

      if (apiError.statusCode === 401) {
        toast.error("Credenciales inválidas", {
          description: "Correo o contraseña incorrectos",
        });
        setErrors({
          email: "Verifica tus credenciales",
          password: "",
        });
      } else if (apiError.statusCode === 423) {
        toast.error("Cuenta bloqueada", {
          description: "Contacta al soporte para más información",
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

  return (
    <>
      <Navbar />
      <section className="min-h-screen px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="max-w-6xl w-full mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda - Información */}
            <div>
              <Card className="border-slate-200 shadow-xl">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-slate-900">
                    Iniciar sesión
                  </CardTitle>
                  <CardDescription>
                    Ingresa tus credenciales para acceder a tu cuenta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                          placeholder="tu@email.com"
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
                          placeholder="Tu contraseña"
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

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked: boolean) =>
                            setRememberMe(checked)
                          }
                        />
                        <label
                          htmlFor="remember"
                          className="text-sm text-slate-600 cursor-pointer"
                        >
                          Recordarme
                        </label>
                      </div>
                      <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>

                    <Button
                      type="submit"
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Iniciando sesión...
                        </>
                      ) : (
                        <>
                          Iniciar sesión
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </Button>

                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-slate-500">
                          O continúa con
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Google
                      </Button>
                      <Button type="button" variant="outline" className="gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                        GitHub
                      </Button>
                    </div>

                    <div className="text-center text-sm text-slate-600 pt-4">
                      ¿No tienes una cuenta?{" "}
                      <Link
                        to="/register"
                        className="text-blue-600 hover:underline"
                      >
                        Regístrate gratis
                      </Link>
                    </div>
                    <div className="text-center text-xs text-slate-500 pt-2">
                      ¿Eres administrador?{" "}
                      <Link
                        to="/admin-login" // Asume esta ruta en tu router
                        className="text-red-500 hover:underline font-medium"
                      >
                        Acceder al Panel de Admin
                      </Link>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <p className="text-center text-xs text-slate-500 mt-4">
                Tus credenciales están protegidas con encriptación de nivel
                bancario
              </p>
            </div>

            {/* Columna derecha - Formulario */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                <Wallet className="w-4 h-4" />
                <span className="text-sm">Bienvenido de nuevo</span>
              </div>

              <div>
                <h1 className="text-slate-900 mb-4">
                  Continúa gestionando tus finanzas
                </h1>
                <p className="text-slate-600 text-lg">
                  Accede a tu cuenta para ver tus ingresos, gastos y el progreso
                  hacia tus metas financieras.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-200 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📊</span>
                  </div>
                  <div>
                    <div className="text-slate-900 mb-1">
                      Tu información te espera
                    </div>
                    <p className="text-slate-600 text-sm">
                      Accede a tus reportes, gráficos y análisis financieros
                      actualizados.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white">
                <div>
                  <div className="mb-1">10,000+</div>
                  <div className="text-xs text-blue-100">Usuarios</div>
                </div>
                <div>
                  <div className="mb-1">$2M+</div>
                  <div className="text-xs text-blue-100">Ahorrados</div>
                </div>
                <div>
                  <div className="mb-1">4.8★</div>
                  <div className="text-xs text-blue-100">Valoración</div>
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
