import { Button } from "./ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="px-4 py-20 md:py-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Control total de tus finanzas personales</span>
          </div>

          <h1 className="max-w-4xl mx-auto text-slate-900">
            Administra tus ingresos y gastos de forma inteligente
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 text-lg">
            Toma el control de tu dinero con nuestra plataforma intuitiva. Registra tus ingresos,
            controla tus gastos y visualiza tu salud financiera en tiempo real.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                Comenzar Gratis
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Iniciar Sesión
              </Button>
            </Link>
          </div>

          <div className="pt-8 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div>
              <div className="text-blue-600">10,000+</div>
              <div className="text-sm text-slate-600">Usuarios activos</div>
            </div>
            <div>
              <div className="text-blue-600">$2M+</div>
              <div className="text-sm text-slate-600">Ahorrados</div>
            </div>
            <div>
              <div className="text-blue-600">4.8★</div>
              <div className="text-sm text-slate-600">Valoración</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
