import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  TrendingUp,
  PiggyBank,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Footer } from "../components/Footer";

const articles = [
  {
    id: 1,
    title: "5 Estrategias Esenciales para el Ahorro Efectivo",
    excerpt:
      "Descubre métodos probados para incrementar tus ahorros sin sacrificar tu calidad de vida. Aprende a construir un fondo de emergencia sólido.",
    date: "9 de Noviembre, 2025",
    readTime: "5 min",
    icon: PiggyBank,
    color: "from-green-600 to-emerald-700",
    content: [
      {
        subtitle: "1. El Método del 50/30/20",
        text: "Una regla simple pero efectiva: destina el 50% de tus ingresos a necesidades básicas, 30% a deseos y 20% al ahorro. Este método te ayuda a mantener un equilibrio saludable entre disfrutar el presente y asegurar tu futuro.",
      },
      {
        subtitle: "2. Automatiza tus Ahorros",
        text: "Configura transferencias automáticas a una cuenta de ahorros justo después de recibir tu salario. Al 'pagarte a ti mismo primero', eliminas la tentación de gastar ese dinero y garantizas un crecimiento constante de tus ahorros.",
      },
      {
        subtitle: "3. Construye un Fondo de Emergencia",
        text: "Idealmente, deberías tener entre 3 y 6 meses de gastos básicos guardados. Este colchón financiero te protege de imprevistos como pérdida de empleo, reparaciones urgentes o gastos médicos inesperados.",
      },
      {
        subtitle: "4. Reduce Gastos Hormiga",
        text: "Esos pequeños gastos diarios (café, snacks, suscripciones sin usar) pueden sumar cientos al mes. Identifícalos y elimínalos. Una aplicación de gestión financiera te ayuda a visualizar estos patrones de gasto.",
      },
      {
        subtitle: "5. Establece Metas Concretas",
        text: "Ahorrar 'en general' es difícil. Define objetivos específicos: unas vacaciones, el pago inicial de una casa, o tu jubilación. Las metas tangibles te mantienen motivado y enfocado en tu progreso.",
      },
    ],
  },
  {
    id: 2,
    title: "Cómo Crear y Mantener un Presupuesto Personal Realista",
    excerpt:
      "Un presupuesto bien estructurado es la base de la salud financiera. Aprende a crear uno que realmente funcione para ti y tu estilo de vida.",
    date: "8 de Noviembre, 2025",
    readTime: "6 min",
    icon: TrendingUp,
    color: "from-blue-600 to-indigo-700",
    content: [
      {
        subtitle: "Paso 1: Conoce tus Ingresos Reales",
        text: "Calcula tu ingreso neto mensual (después de impuestos). Si tus ingresos varían, usa el promedio de los últimos 6 meses o sé conservador y usa el mes más bajo como base.",
      },
      {
        subtitle: "Paso 2: Rastrea tus Gastos Actuales",
        text: "Durante un mes, registra cada gasto sin excepción. Categorízalos: vivienda, transporte, alimentación, entretenimiento, etc. Te sorprenderá descubrir a dónde va realmente tu dinero.",
      },
      {
        subtitle: "Paso 3: Establece Categorías Realistas",
        text: "Basándote en tus gastos reales, establece límites para cada categoría. Sé honesto contigo mismo: un presupuesto demasiado restrictivo está destinado a fracasar. Deja espacio para el disfrute moderado.",
      },
      {
        subtitle: "Paso 4: Prioriza y Ajusta",
        text: "Identifica gastos esenciales vs opcionales. Reduce gradualmente los gastos no esenciales que menos valor te aporten. Pequeños recortes en múltiples áreas son más sostenibles que eliminar completamente algo que disfrutas.",
      },
      {
        subtitle: "Paso 5: Revisa y Adapta Mensualmente",
        text: "Tu presupuesto no es estático. Revísalo cada mes, celebra tus éxitos y ajusta las categorías problemáticas. La vida cambia, y tu presupuesto debe evolucionar contigo.",
      },
    ],
  },
  {
    id: 3,
    title: "Entendiendo el Crédito: Cómo Usarlo Inteligentemente",
    excerpt:
      "El crédito puede ser una herramienta poderosa o una trampa financiera. Aprende a utilizarlo de manera estratégica para construir tu patrimonio.",
    date: "7 de Noviembre, 2025",
    readTime: "7 min",
    icon: Shield,
    color: "from-purple-600 to-pink-700",
    content: [
      {
        subtitle: "¿Qué es un Score de Crédito?",
        text: "Tu score crediticio es un número (generalmente entre 300-850) que refleja tu comportamiento de pago. Un score alto (700+) te da acceso a mejores tasas de interés, mientras que uno bajo puede costarte miles en intereses adicionales.",
      },
      {
        subtitle: "Cómo Mejorar tu Score",
        text: "Paga siempre a tiempo (35% de tu score), mantén tus saldos bajos (30%), no cierres tarjetas antiguas (15%), limita las solicitudes de crédito nuevas (10%), y diversifica tus tipos de crédito (10%).",
      },
      {
        subtitle: "El Peligro del Pago Mínimo",
        text: "Pagar solo el mínimo mensual puede convertir una compra de $1,000 en una deuda de años con cientos o miles en intereses. Siempre que sea posible, paga el saldo completo antes de la fecha de vencimiento.",
      },
      {
        subtitle: "Usa el Crédito Estratégicamente",
        text: "Las tarjetas de crédito no son dinero extra, son préstamos. Úsalas solo para gastos planificados que puedas pagar al final del mes. Aprovecha las recompensas y protecciones, pero nunca gastes más por obtener puntos.",
      },
      {
        subtitle: "Cuándo Evitar el Crédito",
        text: "Evita créditos para gastos discrecionales como vacaciones o artículos de lujo si no tienes el dinero ahorrado. Nunca uses una tarjeta de crédito para pagar otra deuda a menos que la nueva tasa sea significativamente mejor.",
      },
    ],
  },
  {
    id: 4,
    title: "Por Qué Finance Manager es tu Mejor Aliado Financiero",
    excerpt:
      "Descubre cómo nuestra plataforma simplifica la gestión de tus finanzas personales y te ayuda a alcanzar tus metas económicas más rápido.",
    date: "9 de Noviembre, 2025",
    readTime: "4 min",
    icon: Zap,
    color: "from-orange-600 to-red-700",
    content: [
      {
        subtitle: "Simplicidad que Impulsa la Acción",
        text: "Sabemos que la gestión financiera puede ser abrumadora. Por eso diseñamos Finance Manager con una interfaz intuitiva que cualquiera puede usar desde el primer día. No necesitas ser un experto en finanzas para tomar el control de tu dinero.",
      },
      {
        subtitle: "Visión Completa en Tiempo Real",
        text: "Olvídate de las hojas de cálculo complicadas. Con nuestro dashboard, visualizas todos tus ingresos, gastos y ahorros en un solo lugar. Gráficos claros y reportes automáticos te muestran exactamente dónde estás parado financieramente.",
      },
      {
        subtitle: "Categorización Inteligente",
        text: "Organiza tus transacciones en categorías personalizables. ¿Gastas demasiado en entretenimiento? ¿Tus gastos de transporte están aumentando? Identificar patrones nunca fue tan fácil, permitiéndote tomar decisiones informadas.",
      },
      {
        subtitle: "Múltiples Cuentas, Una Plataforma",
        text: "Gestiona todas tus cuentas bancarias, tarjetas de crédito y cuentas de ahorro en un solo lugar. Ya no necesitas hacer malabarismos entre diferentes apps o plataformas para ver tu panorama financiero completo.",
      },
      {
        subtitle: "Seguridad que te Protege",
        text: "Tus datos financieros son sagrados. Utilizamos encriptación de nivel bancario, autenticación segura y mejores prácticas de la industria para garantizar que tu información esté siempre protegida.",
      },
      {
        subtitle: "Gratis y Accesible",
        text: "Creemos que todos merecen herramientas de calidad para gestionar su dinero. Finance Manager es completamente gratuito, sin costos ocultos ni suscripciones premium que limiten funcionalidades esenciales.",
      },
    ],
  },
];

export function ArticlesPage() {
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const article =
    selectedArticle !== null
      ? articles.find((a) => a.id === selectedArticle)
      : null;

  if (article) {
    const IconComponent = article.icon;
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Navbar />
        {/* Header con espacio para navbar */}
        <div className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              onClick={() => setSelectedArticle(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Artículos
            </Button>

            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${article.color} rounded-lg flex items-center justify-center`}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {article.title}
            </h1>

            <div className="flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{article.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{article.readTime} de lectura</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-10">
            <p className="text-xl text-slate-700 mb-10 leading-relaxed border-l-4 border-blue-600 pl-6">
              {article.excerpt}
            </p>

            <div className="space-y-8">
              {article.content.map((section, index) => (
                <div key={index} className="space-y-3">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {section.subtitle}
                  </h2>
                  <p className="text-base text-slate-700 leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div
              className={`mt-12 p-6 bg-gradient-to-r ${article.color} rounded-xl`}
            >
              <h3 className="text-2xl font-bold text-white mb-2">
                ¿Listo para tomar el control de tus finanzas?
              </h3>
              <p className="text-white/90 mb-4">
                Empieza hoy mismo con Finance Manager y transforma tu futuro
                financiero.
              </p>
              <Link to="/register">
                <Button
                  size="lg"
                  className="bg-white text-slate-900 hover:bg-slate-100"
                >
                  Crear Cuenta Gratis
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // Lista de artículos
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navbar />
      {/* Hero Section con espacio para navbar */}
      <section className="px-4 pt-32 pb-20 py-12 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full border border-blue-200 mb-6">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Educación Financiera</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 py-4 md:py-8">
            Artículos de Finanzas Personales
          </h1>

          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Consejos prácticos, estrategias comprobadas y conocimiento
            financiero para ayudarte a construir un futuro próspero
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {articles.map((article) => {
            const IconComponent = article.icon;
            return (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
                onClick={() => setSelectedArticle(article.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${article.color}`} />

                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-r ${article.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                    >
                      <IconComponent className="w-8 h-8 text-blue-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                        {article.title}
                      </h2>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-3 h-3" />
                          <span>{article.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-slate-50"
                  >
                    Leer Artículo Completo
                  </Button>
                </div>
              </article>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-xl p-8 md:p-12 text-center text-slate-900">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-700">
            Transforma tu Conocimiento en Acción
          </h2>
          <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Estos artículos son solo el comienzo. Con Finance Manager, puedes
            aplicar todo lo que aprendes de forma inmediata.
          </p>
          <Link to="/register">
            <Button
              size="lg"
              className="bg-blue-600 text-white hover:bg-blue-700 font-semibold"
            >
              Empieza Gratis Hoy
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
