import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import useRedirect from "../basicFunctions/functions";

export function CTA() {
  const { goToRegister } = useRedirect();

  return (
    <section className="px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />

          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm">
                Comienza gratis, sin tarjeta de crédito
              </span>
            </div>

            <div>
              <h2 className="text-white mb-4">
                Empieza a construir tu libertad financiera hoy
              </h2>
              <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                Únete a miles de personas que ya están tomando control de sus
                finanzas. Es gratis, es fácil y puede cambiar tu vida.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={goToRegister}
                size="lg"
                variant="secondary"
                className="gap-2"
              >
                Crear Cuenta Gratis
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent text-white border-white hover:bg-white/10"
              >
                Contactar Ventas
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-white/90 text-sm pt-4">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Sin compromiso</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Cancela cuando quieras</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Soporte 24/7</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
