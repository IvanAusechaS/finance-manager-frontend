import { UserPlus, Plus, BarChart3 } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    number: "01",
    title: "Crea tu cuenta",
    description: "Regístrate en segundos y configura tu perfil financiero personalizado.",
  },
  {
    icon: Plus,
    number: "02",
    title: "Registra tus movimientos",
    description: "Añade tus ingresos y gastos fácilmente. Categoriza cada transacción.",
  },
  {
    icon: BarChart3,
    number: "03",
    title: "Visualiza y optimiza",
    description: "Analiza tus reportes, identifica patrones y toma decisiones inteligentes.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-slate-900">Comienza en 3 simples pasos</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            En menos de 5 minutos estarás en control total de tus finanzas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm">
                  {step.number}
                </div>
              </div>
              <h3 className="text-slate-900">{step.title}</h3>
              <p className="text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
