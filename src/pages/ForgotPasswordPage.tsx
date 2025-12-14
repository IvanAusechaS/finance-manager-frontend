import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "../utils/toast";
import { validateEmail, validateRequired } from "../lib/validations";
import { Footer } from "../components/Footer";

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validateField = (value: string): string => {
    if (!validateRequired(value)) {
      return "Este campo es requerido";
    }
    if (!validateEmail(value)) {
      return "Formato de correo inválido";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (touched) {
      const validationError = validateField(value);
      setError(validationError);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateField(email);
    setError(validationError);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched(true);
    const validationError = validateField(email);
    setError(validationError);

    if (validationError) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulación de envío de correo (reemplazar con API real)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("✅ [ForgotPassword] Correo enviado exitosamente");
      toast.success("Correo enviado", {
        description:
          "Revisa tu bandeja de entrada para restablecer tu contraseña",
        icon: <CheckCircle2 />,
      });

      // Redirigir a página de éxito
      navigate("/password-reset-success", { state: { email } });
    } catch (error) {
      console.error("❌ [ForgotPassword] Error al enviar correo:", error);
      toast.error("Error al enviar correo", {
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
                ¿Olvidaste tu contraseña?
              </CardTitle>
              <CardDescription>
                Ingresa tu correo electrónico y te enviaremos instrucciones para
                restablecer tu contraseña
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
                      value={email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`pl-10 ${
                        error && touched ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {error && touched && (
                      <p className="text-sm text-red-500 mt-1">{error}</p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>Enviar instrucciones</>
                  )}
                </Button>

                <div className="text-center pt-4">
                  <Link
                    to="/login"
                    className="text-sm text-blue-600 hover:underline inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <p className="text-center text-xs text-slate-500 mt-4">
            Si no recibes el correo en unos minutos, revisa tu carpeta de spam
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
