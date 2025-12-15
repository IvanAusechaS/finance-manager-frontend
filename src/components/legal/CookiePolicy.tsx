import { LegalOverlay } from "./LegalOverlay";

interface CookiePolicyProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function CookiePolicy({ isOpen, onClose }: CookiePolicyProps) {
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
      title="Política de Cookies"
      lastUpdated="14 de Noviembre de 2025"
    >
      {/* Tabla de Contenidos */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-purple-900 mb-3">
          Tabla de Contenidos
        </h3>
        <nav className="space-y-2">
          <button
            onClick={() => scrollToSection("que-son-cookies")}
            className="block text-left text-sm text-purple-700 hover:text-purple-900 hover:underline"
          >
            1. ¿Qué son las Cookies?
          </button>
          <button
            onClick={() => scrollToSection("como-usamos")}
            className="block text-left text-sm text-purple-700 hover:text-purple-900 hover:underline"
          >
            2. Cómo Usamos las Cookies
          </button>
          <button
            onClick={() => scrollToSection("tipos-cookies")}
            className="block text-left text-sm text-purple-700 hover:text-purple-900 hover:underline"
          >
            3. Tipos de Cookies que Utilizamos
          </button>
          <button
            onClick={() => scrollToSection("cookies-terceros")}
            className="block text-left text-sm text-purple-700 hover:text-purple-900 hover:underline"
          >
            4. Cookies de Terceros
          </button>
          <button
            onClick={() => scrollToSection("gestionar-cookies")}
            className="block text-left text-sm text-purple-700 hover:text-purple-900 hover:underline"
          >
            5. Cómo Gestionar las Cookies
          </button>
          <button
            onClick={() => scrollToSection("otras-tecnologias")}
            className="block text-left text-sm text-purple-700 hover:text-purple-900 hover:underline"
          >
            6. Otras Tecnologías de Seguimiento
          </button>
          <button
            onClick={() => scrollToSection("actualizaciones")}
            className="block text-left text-sm text-purple-700 hover:text-purple-900 hover:underline"
          >
            7. Actualizaciones
          </button>
        </nav>
      </div>

      {/* Contenido */}
      <section id="que-son-cookies" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          1. ¿Qué son las Cookies?
        </h3>
        <p className="text-slate-700 mb-3">
          Las cookies son pequeños archivos de texto que se almacenan en su
          dispositivo cuando visita un sitio web. Se utilizan ampliamente para
          hacer que los sitios web funcionen de manera más eficiente y
          proporcionen información a los propietarios del sitio.
        </p>
        <p className="text-slate-700">
          Las cookies pueden ser "persistentes" o "de sesión". Las cookies
          persistentes permanecen en su dispositivo hasta que caducan o las
          elimina. Las cookies de sesión se eliminan cuando cierra su navegador.
        </p>
      </section>

      <section id="como-usamos" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          2. Cómo Usamos las Cookies
        </h3>
        <p className="text-slate-700 mb-3">
          Utilizamos cookies para varios propósitos:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
          <li>
            <strong>Autenticación:</strong> Para recordar que ha iniciado sesión
            y mantener su sesión activa
          </li>
          <li>
            <strong>Seguridad:</strong> Para proteger su cuenta y detectar
            actividades sospechosas
          </li>
          <li>
            <strong>Preferencias:</strong> Para recordar sus configuraciones y
            preferencias
          </li>
          <li>
            <strong>Rendimiento:</strong> Para entender cómo utiliza nuestro
            servicio y mejorarlo
          </li>
          <li>
            <strong>Análisis:</strong> Para generar estadísticas sobre el uso
            del sitio
          </li>
        </ul>
      </section>

      <section id="tipos-cookies" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          3. Tipos de Cookies que Utilizamos
        </h3>

        <div className="space-y-4">
          {/* Cookies Esenciales */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">🔒</span>
              <span>Cookies Esenciales (Siempre Activas)</span>
            </h4>
            <p className="text-slate-700 mb-3">
              Estas cookies son necesarias para el funcionamiento básico del
              sitio. Sin ellas, el servicio no puede funcionar correctamente.
            </p>
            <div className="bg-white rounded p-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Cookie</th>
                    <th className="text-left py-2">Propósito</th>
                    <th className="text-left py-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-mono text-xs">AccessToken</td>
                    <td className="py-2">Autenticación de sesión</td>
                    <td className="py-2">24 horas</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-mono text-xs">RefreshToken</td>
                    <td className="py-2">Renovación de sesión</td>
                    <td className="py-2">7 días</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">deviceId</td>
                    <td className="py-2">Identificación de dispositivo</td>
                    <td className="py-2">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cookies de Funcionalidad */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">⚙️</span>
              <span>Cookies Funcionales</span>
            </h4>
            <p className="text-slate-700 mb-3">
              Estas cookies permiten que el sitio recuerde las elecciones que
              hace (como su idioma o región) y proporcionan funciones mejoradas
              y más personales.
            </p>
            <div className="bg-white rounded p-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Cookie</th>
                    <th className="text-left py-2">Propósito</th>
                    <th className="text-left py-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 font-mono text-xs">user_preferences</td>
                    <td className="py-2">Configuración de usuario</td>
                    <td className="py-2">1 año</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-mono text-xs">theme</td>
                    <td className="py-2">Tema de interfaz (claro/oscuro)</td>
                    <td className="py-2">1 año</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Cookies de Análisis */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
              <span className="text-xl" aria-hidden="true">📊</span>
              <span>Cookies de Análisis</span>
            </h4>
            <p className="text-slate-700 mb-3">
              Estas cookies nos ayudan a entender cómo los visitantes
              interactúan con el sitio, recopilando información de forma
              anónima.
            </p>
            <div className="bg-white rounded p-3">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Cookie</th>
                    <th className="text-left py-2">Propósito</th>
                    <th className="text-left py-2">Duración</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 font-mono text-xs">_analytics_*</td>
                    <td className="py-2">Estadísticas de uso anónimas</td>
                    <td className="py-2">2 años</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="cookies-terceros" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          4. Cookies de Terceros
        </h3>
        <p className="text-slate-700 mb-3">
          Algunos proveedores de servicios pueden establecer cookies en nuestro
          sitio:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
          <li>
            <strong>Servicios de análisis:</strong> Para ayudarnos a entender el
            uso del sitio
          </li>
          <li>
            <strong>Proveedores de CDN:</strong> Para mejorar la velocidad de
            carga
          </li>
          <li>
            <strong>Servicios de seguridad:</strong> Para proteger contra
            ataques
          </li>
        </ul>
        <p className="text-slate-700">
          Estos terceros tienen sus propias políticas de privacidad sobre cómo
          utilizan dicha información.
        </p>
      </section>

      <section id="gestionar-cookies" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          5. Cómo Gestionar las Cookies
        </h3>
        <p className="text-slate-700 mb-3">
          Puede controlar y/o eliminar las cookies como desee. Puede eliminar
          todas las cookies que ya están en su dispositivo y configurar la
          mayoría de los navegadores para evitar que se coloquen.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-slate-800 mb-3">
            Configuración por Navegador:
          </h4>
          <div className="space-y-2 text-sm text-slate-700">
            <p>
              <strong>Chrome:</strong> Configuración → Privacidad y seguridad →
              Cookies
            </p>
            <p>
              <strong>Firefox:</strong> Opciones → Privacidad y seguridad →
              Cookies
            </p>
            <p>
              <strong>Safari:</strong> Preferencias → Privacidad → Cookies
            </p>
            <p>
              <strong>Edge:</strong> Configuración → Cookies y permisos del
              sitio
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 text-sm">
            <strong>⚠️ Importante:</strong> Si deshabilita las cookies
            esenciales, algunas funciones del sitio pueden no funcionar
            correctamente, incluyendo la capacidad de iniciar sesión.
          </p>
        </div>
      </section>

      <section id="otras-tecnologias" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          6. Otras Tecnologías de Seguimiento
        </h3>
        <p className="text-slate-700 mb-3">
          Además de cookies, también utilizamos:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-2">
          <li>
            <strong>Local Storage:</strong> Para almacenar datos de
            configuración localmente
          </li>
          <li>
            <strong>Session Storage:</strong> Para datos temporales durante su
            sesión
          </li>
          <li>
            <strong>Web Beacons:</strong> Para análisis de uso de páginas
          </li>
        </ul>
      </section>

      <section id="actualizaciones" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          7. Actualizaciones de esta Política
        </h3>
        <p className="text-slate-700 mb-3">
          Podemos actualizar esta Política de Cookies ocasionalmente para
          reflejar cambios en las cookies que utilizamos o por razones
          operativas, legales o regulatorias.
        </p>
        <p className="text-slate-700">
          Le recomendamos que revise esta página periódicamente para estar
          informado sobre cómo utilizamos las cookies.
        </p>
      </section>

      {/* Contacto */}
      <div className="bg-slate-100 border border-slate-300 rounded-lg p-4 mt-6">
        <h4 className="font-semibold text-slate-900 mb-2">
          ¿Preguntas sobre Cookies?
        </h4>
        <p className="text-slate-700 text-sm">
          Si tiene preguntas sobre nuestra Política de Cookies, contacte a{" "}
          <a
            href="mailto:privacy@finanzasapp.com"
            className="text-blue-600 hover:underline"
          >
            privacy@finanzasapp.com
          </a>
        </p>
      </div>
    </LegalOverlay>
  );
}
