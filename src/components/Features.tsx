import {
  Wallet,
  PieChart,
  Bell,
  Lock,
  TrendingDown,
  Calendar,
} from "lucide-react";
import { Card, CardContent } from "./ui/card";

const features = [
  {
    icon: Wallet,
    title: "Registro de Ingresos",
    description:
      "Registra todas tus fuentes de ingresos de manera simple y rápida. Categoriza y organiza tu dinero entrante.",
  },
  {
    icon: TrendingDown,
    title: "Control de Gastos",
    description:
      "Monitorea cada peso que gastas. Clasifica tus egresos por categorías y identifica donde puedes ahorrar.",
  },
  {
    icon: PieChart,
    title: "Visualización Inteligente",
    description:
      "Gráficos y reportes detallados que te ayudan a entender tu comportamiento financiero de un vistazo.",
  },
  {
    icon: Calendar,
    title: "Historial Completo",
    description:
      "Accede a todo tu historial de transacciones. Filtra por fechas, categorías y tipos de movimiento.",
  },
  {
    icon: Bell,
    title: "Alertas Personalizadas",
    description:
      "Recibe notificaciones cuando te acerques a tus límites de gasto o tengas pagos pendientes.",
  },
  {
    icon: Lock,
    title: "100% Seguro",
    description:
      "Tus datos financieros están protegidos con encriptación de nivel bancario. Tu privacidad es nuestra prioridad.",
  },
];

export function Features() {
  return (
    <section className="px-4 py-20 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-slate-900">
            Todo lo que necesitas para gestionar tu dinero
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Herramientas poderosas y fáciles de usar diseñadas para ayudarte a
            alcanzar tus metas financieras
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-slate-200 hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
