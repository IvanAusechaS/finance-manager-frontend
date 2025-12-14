import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
import { Lock, Loader2, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { toast } from "../utils/toast";
import { validateRequired } from "../lib/validations";
import { Footer } from "../components/Footer";

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  const validatePassword = (password: string): string => {
    if (!validateRequired(password)) {
      return "Este campo es requerido";
    }
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(password)) {
      return "Debe contener al menos una letra mayúscula";
    }
    if (!/[a-z]/.test(password)) {
      return "Debe contener al menos una letra minúscula";
    }
    if (!/[0-9]/.test(password)) {
      return "Debe contener al menos un número";
    }
    return "";
  };

  const validateConfirmPassword = (confirmPassword: string): string => {
    if (!validateRequired(confirmPassword)) {
      return "Este campo es requerido";
    }
    if (confirmPassword !== formData.password) {
      return "Las contraseñas no coinciden";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name as keyof typeof touched]) {
      const error =
        name === "password"
          ? validatePassword(value)
          : validateConfirmPassword(value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error =
      name === "password"
        ? validatePassword(value)
        : validateConfirmPassword(value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      password: true,
      confirmPassword: true,
    });

    const newErrors = {
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(formData.confirmPassword),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error !== "")) {
      console.log("❌ [ResetPassword] Errores de validación:", newErrors);
      return;
    }

    if (!token) {
      toast.error("Token inválido", {
        description: "El enlace de recuperación no es válido",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulación de actualización de contraseña (reemplazar con API real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Contraseña actualizada", {
        description: "Tu contraseña ha sido restablecida exitosamente",
        icon: <CheckCircle2 />,
      });

      // Redirigir al login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(
        "❌ [ResetPassword] Error al actualizar contraseña:",
        error
      );
      toast.error("Error al actualizar contraseña", {
        description: "Por favor, intenta de nuevo más tarde",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="min-h-screen px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <Card className="border-slate-200 shadow-xl">
            <CardHeader className="space-y-1">
              <CardTitle className="text-slate-900">
                Restablecer contraseña
              </CardTitle>
              <CardDescription>
                Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700">
                    Nueva contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-10 pr-10 ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {errors.password && touched.password && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.password}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-700">
                    Confirmar contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-10 pr-10 ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500"
                          : ""
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-700">
                    <strong>Requisitos de la contraseña:</strong>
                    <br />• Mínimo 8 caracteres
                    <br />• Una letra mayúscula
                    <br />• Una letra minúscula
                    <br />• Un número
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Actualizando...
                    </>
                  ) : (
                    <>Restablecer contraseña</>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <Link
                    to="/login"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  );
}
