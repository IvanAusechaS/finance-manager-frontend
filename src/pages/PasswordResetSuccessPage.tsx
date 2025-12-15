import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import { Footer } from "../components/Footer";

export function PasswordResetSuccessPage() {
  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <>
      <section className="min-h-screen px-4 py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <Card className="border-slate-200 shadow-xl p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-900">
                ¡Correo enviado!
              </h1>
              <p className="text-slate-600">
                Hemos enviado las instrucciones para restablecer tu contraseña
                a:
              </p>
              {email && (
                <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
                  <Mail className="w-4 h-4" />
                  <span>{email}</span>
                </div>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Siguiente paso:</strong>
                <br />
                Revisa tu bandeja de entrada y haz clic en el enlace para
                restablecer tu contraseña.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link to="/login" className="block">
                <Button className="w-full gap-2">
                  Volver al inicio de sesión
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <p className="text-xs text-slate-500">
                ¿No recibiste el correo? Revisa tu carpeta de spam o{" "}
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:underline"
                >
                  reenvía el correo
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </>
  );
}
