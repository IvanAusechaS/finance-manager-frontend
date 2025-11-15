import { CheckCircle2 } from "lucide-react";

const benefits = [
  {
    title: "Ahorra más dinero",
    description:
      "Identifica gastos innecesarios y oportunidades de ahorro. Los usuarios ahorran en promedio 25% más al mes.",
  },
  {
    title: "Toma mejores decisiones",
    description:
      "Con información clara y precisa sobre tus finanzas, toma decisiones informadas sobre tu dinero.",
  },
  {
    title: "Alcanza tus metas",
    description:
      "Define objetivos de ahorro y sigue tu progreso. Haz realidad tus planes financieros.",
  },
  {
    title: "Elimina el estrés financiero",
    description:
      "Saber exactamente dónde está tu dinero te da paz mental y control sobre tu futuro.",
  },
];

export function Benefits() {
  return (
    <section className="px-4 py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-slate-900 mb-4">Transforma tu relación con el dinero</h2>
              <p className="text-slate-600 text-lg">
                No se trata solo de registrar números. Se trata de construir hábitos financieros
                saludables que cambiarán tu vida para siempre.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-slate-900 mb-1">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <span className="text-slate-600">Balance Total</span>
                <span className="text-green-600">Este Mes</span>
              </div>
              <div>
                <div className="text-slate-500 text-sm mb-1">Total Disponible</div>
                <div className="text-slate-900">$12,450.00</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-600 text-sm mb-1">Ingresos</div>
                  <div className="text-green-900">$8,500.00</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-red-600 text-sm mb-1">Gastos</div>
                  <div className="text-red-900">$3,250.00</div>
                </div>
              </div>
              <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      🏠
                    </div>
                    <div>
                      <div className="text-slate-900 text-sm">Alquiler</div>
                      <div className="text-slate-500 text-xs">15 Nov 2025</div>
                    </div>
                  </div>
                  <div className="text-red-600">-$1,200</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      💼
                    </div>
                    <div>
                      <div className="text-slate-900 text-sm">Salario</div>
                      <div className="text-slate-500 text-xs">1 Nov 2025</div>
                    </div>
                  </div>
                  <div className="text-green-600">+$5,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
