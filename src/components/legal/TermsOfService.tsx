import { LegalOverlay } from "./LegalOverlay";

interface TermsOfServiceProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsOfService({ isOpen, onClose }: TermsOfServiceProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <LegalOverlay
      isOpen={isOpen}
      onClose={onClose}
      title="Términos y Condiciones"
      lastUpdated="14 de Noviembre de 2025"
    >
      {/* Tabla de Contenidos */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-green-900 mb-3">
          Tabla de Contenidos
        </h3>
        <nav className="space-y-2">
          <button
            onClick={() => scrollToSection("aceptacion")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            1. Aceptación de Términos
          </button>
          <button
            onClick={() => scrollToSection("descripcion")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            2. Descripción del Servicio
          </button>
          <button
            onClick={() => scrollToSection("registro")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            3. Registro y Cuenta
          </button>
          <button
            onClick={() => scrollToSection("uso-aceptable")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            4. Uso Aceptable
          </button>
          <button
            onClick={() => scrollToSection("responsabilidades")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            5. Responsabilidades del Usuario
          </button>
          <button
            onClick={() => scrollToSection("propiedad-intelectual")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            6. Propiedad Intelectual
          </button>
          <button
            onClick={() => scrollToSection("limitacion-responsabilidad")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            7. Limitación de Responsabilidad
          </button>
          <button
            onClick={() => scrollToSection("terminacion")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            8. Terminación
          </button>
          <button
            onClick={() => scrollToSection("ley-aplicable")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            9. Ley Aplicable
          </button>
          <button
            onClick={() => scrollToSection("contacto")}
            className="block text-left text-sm text-green-700 hover:text-green-900 hover:underline"
          >
            10. Contacto
          </button>
        </nav>
      </div>

      {/* Contenido */}
      <section id="aceptacion" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          1. Aceptación de Términos
        </h3>
        <p className="text-slate-700 mb-3">
          Al acceder y utilizar FinanzasApp ("el Servicio"), usted acepta estar
          legalmente vinculado por estos Términos y Condiciones. Si no está de
          acuerdo con alguna parte de estos términos, no debe utilizar nuestro
          servicio.
        </p>
        <p className="text-slate-700">
          Estos términos se aplican a todos los visitantes, usuarios y otras
          personas que acceden o utilizan el Servicio.
        </p>
      </section>

      <section id="descripcion" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          2. Descripción del Servicio
        </h3>
        <p className="text-slate-700 mb-3">
          FinanzasApp es una plataforma de gestión financiera personal que
          permite a los usuarios:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>Registrar y categorizar transacciones financieras</li>
          <li>Crear y gestionar múltiples cuentas</li>
          <li>Establecer y seguir metas de ahorro</li>
          <li>Generar informes y análisis financieros</li>
          <li>Programar recordatorios de pagos</li>
          <li>Visualizar estadísticas y tendencias</li>
        </ul>
        <p className="text-slate-700">
          El Servicio es proporcionado "tal cual" y puede ser modificado,
          actualizado o discontinuado en cualquier momento.
        </p>
      </section>

      <section id="registro" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          3. Registro y Cuenta
        </h3>
        <h4 className="font-semibold text-slate-800 mb-2">
          3.1. Requisitos de Cuenta:
        </h4>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>Debe ser mayor de 18 años para crear una cuenta</li>
          <li>Debe proporcionar información precisa y completa</li>
          <li>Debe mantener la confidencialidad de su contraseña</li>
          <li>Es responsable de todas las actividades bajo su cuenta</li>
        </ul>

        <h4 className="font-semibold text-slate-800 mb-2">
          3.2. Seguridad de la Cuenta:
        </h4>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>
            Debe notificarnos inmediatamente de cualquier uso no autorizado
          </li>
          <li>No debe compartir sus credenciales con terceros</li>
          <li>Debe utilizar una contraseña segura</li>
          <li>
            Recomendamos activar la autenticación de dos factores cuando esté
            disponible
          </li>
        </ul>
      </section>

      <section id="uso-aceptable" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          4. Uso Aceptable
        </h3>
        <p className="text-slate-700 mb-3">
          Usted acepta NO utilizar el Servicio para:
        </p>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <ul className="space-y-2 text-slate-700">
            <li>❌ Violar leyes o regulaciones aplicables</li>
            <li>❌ Infringir derechos de propiedad intelectual</li>
            <li>❌ Transmitir virus, malware o código malicioso</li>
            <li>❌ Intentar acceder a cuentas de otros usuarios</li>
            <li>❌ Realizar ingeniería inversa del servicio</li>
            <li>❌ Utilizar el servicio para actividades fraudulentas</li>
            <li>❌ Recopilar datos de otros usuarios sin autorización</li>
            <li>❌ Interferir con el funcionamiento del servicio</li>
            <li>❌ Crear cuentas mediante medios automatizados</li>
          </ul>
        </div>
      </section>

      <section id="responsabilidades" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          5. Responsabilidades del Usuario
        </h3>
        <h4 className="font-semibold text-slate-800 mb-2">
          5.1. Exactitud de Datos:
        </h4>
        <p className="text-slate-700 mb-3">
          Usted es responsable de la exactitud de toda la información financiera
          que ingresa en el Servicio. FinanzasApp no verifica la exactitud de
          sus transacciones o datos.
        </p>

        <h4 className="font-semibold text-slate-800 mb-2">
          5.2. Decisiones Financieras:
        </h4>
        <p className="text-slate-700 mb-3">
          FinanzasApp es una herramienta de gestión financiera, NO proporciona
          asesoramiento financiero, legal o fiscal. Todas las decisiones
          financieras son su responsabilidad exclusiva.
        </p>

        <h4 className="font-semibold text-slate-800 mb-2">
          5.3. Respaldo de Datos:
        </h4>
        <p className="text-slate-700">
          Aunque hacemos respaldos regulares, le recomendamos que mantenga sus
          propias copias de seguridad de información crítica.
        </p>
      </section>

      <section id="propiedad-intelectual" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          6. Propiedad Intelectual
        </h3>
        <p className="text-slate-700 mb-3">
          El Servicio y todo su contenido, características y funcionalidad son
          propiedad de FinanzasApp y están protegidos por leyes de derechos de
          autor, marcas registradas y otras leyes de propiedad intelectual.
        </p>
        <p className="text-slate-700 mb-3">
          Se le otorga una licencia limitada, no exclusiva, no transferible
          para:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>Acceder y usar el Servicio para su uso personal</li>
          <li>Ver y almacenar el contenido en caché localmente</li>
        </ul>
        <p className="text-slate-700">
          Sus datos financieros personales son de su propiedad. Nos otorga una
          licencia para almacenar, procesar y mostrar esos datos únicamente para
          proporcionar el Servicio.
        </p>
      </section>

      <section id="limitacion-responsabilidad" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          7. Limitación de Responsabilidad
        </h3>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
          <p className="text-slate-700 mb-3">
            <strong>AVISO IMPORTANTE:</strong> En la máxima medida permitida por
            la ley:
          </p>
          <ul className="list-disc pl-6 text-slate-700 space-y-2">
            <li>
              El servicio se proporciona "TAL CUAL" y "SEGÚN DISPONIBILIDAD"
            </li>
            <li>
              No garantizamos que el servicio será ininterrumpido o libre de
              errores
            </li>
            <li>
              No nos hacemos responsables de pérdidas de datos o interrupciones
            </li>
            <li>
              No somos responsables de decisiones financieras tomadas basándose
              en el uso del servicio
            </li>
            <li>
              Nuestra responsabilidad total no excederá el monto pagado por
              usted en los últimos 12 meses (o $100 USD si el servicio es
              gratuito)
            </li>
          </ul>
        </div>
      </section>

      <section id="terminacion" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          8. Terminación
        </h3>
        <h4 className="font-semibold text-slate-800 mb-2">
          8.1. Por parte del Usuario:
        </h4>
        <p className="text-slate-700 mb-3">
          Puede terminar su cuenta en cualquier momento desde la configuración
          de su perfil. Tras la terminación, sus datos serán eliminados de
          acuerdo con nuestra Política de Privacidad.
        </p>

        <h4 className="font-semibold text-slate-800 mb-2">
          8.2. Por parte de FinanzasApp:
        </h4>
        <p className="text-slate-700 mb-3">
          Podemos suspender o terminar su cuenta si:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>Viola estos Términos y Condiciones</li>
          <li>Realiza actividades fraudulentas o ilegales</li>
          <li>No paga las tarifas aplicables (si aplica)</li>
          <li>Su cuenta permanece inactiva por más de 2 años</li>
        </ul>
      </section>

      <section id="ley-aplicable" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          9. Ley Aplicable
        </h3>
        <p className="text-slate-700 mb-3">
          Estos Términos se rigen por las leyes de [Jurisdicción] sin tener en
          cuenta sus disposiciones sobre conflictos de leyes.
        </p>
        <p className="text-slate-700">
          Cualquier disputa relacionada con estos Términos será resuelta
          mediante arbitraje vinculante, excepto donde esté prohibido por ley.
        </p>
      </section>

      <section id="contacto" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          10. Contacto
        </h3>
        <p className="text-slate-700 mb-3">
          Si tiene preguntas sobre estos Términos y Condiciones, contacte a:
        </p>
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
          <p className="text-slate-800">
            <strong>FinanzasApp</strong>
            <br />
            Email:{" "}
            <a
              href="mailto:legal@finanzasapp.com"
              className="text-blue-600 hover:underline"
            >
              legal@finanzasapp.com
            </a>
            <br />
            Soporte:{" "}
            <a
              href="mailto:support@finanzasapp.com"
              className="text-blue-600 hover:underline"
            >
              support@finanzasapp.com
            </a>
          </p>
        </div>
      </section>
    </LegalOverlay>
  );
}
