import { LegalOverlay } from "./LegalOverlay";

interface PrivacyPolicyProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PrivacyPolicy({ isOpen, onClose }: PrivacyPolicyProps) {
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
      title="Política de Privacidad"
      lastUpdated="14 de Noviembre de 2025"
    >
      {/* Tabla de Contenidos */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          Tabla de Contenidos
        </h3>
        <nav className="space-y-2">
          <button
            onClick={() => scrollToSection("introduccion")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            1. Introducción
          </button>
          <button
            onClick={() => scrollToSection("informacion-recopilada")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            2. Información que Recopilamos
          </button>
          <button
            onClick={() => scrollToSection("uso-informacion")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            3. Uso de la Información
          </button>
          <button
            onClick={() => scrollToSection("compartir-informacion")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            4. Compartir Información
          </button>
          <button
            onClick={() => scrollToSection("cookies")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            5. Cookies y Tecnologías de Seguimiento
          </button>
          <button
            onClick={() => scrollToSection("derechos-usuario")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            6. Derechos del Usuario
          </button>
          <button
            onClick={() => scrollToSection("seguridad")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            7. Seguridad de Datos
          </button>
          <button
            onClick={() => scrollToSection("retencion")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            8. Retención de Datos
          </button>
          <button
            onClick={() => scrollToSection("gdpr-ccpa")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            9. Cumplimiento GDPR y CCPA
          </button>
          <button
            onClick={() => scrollToSection("menores")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            10. Privacidad de Menores
          </button>
          <button
            onClick={() => scrollToSection("cambios")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            11. Cambios a esta Política
          </button>
          <button
            onClick={() => scrollToSection("contacto")}
            className="block text-left text-sm text-blue-700 hover:text-blue-900 hover:underline"
          >
            12. Contacto
          </button>
        </nav>
      </div>

      {/* Contenido */}
      <section id="introduccion" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          1. Introducción
        </h3>
        <p className="text-slate-700 mb-3">
          Bienvenido a FinanzasApp. Nos tomamos muy en serio la privacidad de
          nuestros usuarios. Esta Política de Privacidad explica cómo
          recopilamos, usamos, compartimos y protegemos su información personal
          cuando utiliza nuestro servicio de gestión financiera.
        </p>
        <p className="text-slate-700">
          Al utilizar FinanzasApp, usted acepta las prácticas descritas en esta
          política. Si no está de acuerdo con estas prácticas, por favor no
          utilice nuestro servicio.
        </p>
      </section>

      <section id="informacion-recopilada" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          2. Información que Recopilamos
        </h3>
        <h4 className="font-semibold text-slate-800 mb-2">
          2.1. Información que usted proporciona:
        </h4>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>
            <strong>Información de cuenta:</strong> Nombre, correo electrónico,
            contraseña (encriptada)
          </li>
          <li>
            <strong>Información financiera:</strong> Transacciones, cuentas
            bancarias, categorías, tags, metas de ahorro
          </li>
          <li>
            <strong>Información de perfil:</strong> Preferencias, configuración
            de usuario
          </li>
        </ul>

        <h4 className="font-semibold text-slate-800 mb-2">
          2.2. Información recopilada automáticamente:
        </h4>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>
            <strong>Datos de uso:</strong> Páginas visitadas, funciones
            utilizadas, tiempo de uso
          </li>
          <li>
            <strong>Datos técnicos:</strong> Dirección IP, tipo de navegador,
            sistema operativo, identificador de dispositivo
          </li>
          <li>
            <strong>Cookies:</strong> Ver sección de Cookies para más detalles
          </li>
        </ul>
      </section>

      <section id="uso-informacion" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          3. Uso de la Información
        </h3>
        <p className="text-slate-700 mb-3">Utilizamos su información para:</p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>Proporcionar y mantener nuestro servicio</li>
          <li>Procesar sus transacciones financieras</li>
          <li>Generar informes y análisis personalizados</li>
          <li>Mejorar la seguridad de su cuenta</li>
          <li>Comunicarnos con usted sobre el servicio</li>
          <li>Enviar notificaciones importantes</li>
          <li>Cumplir con obligaciones legales</li>
          <li>Prevenir fraude y actividades ilegales</li>
        </ul>
      </section>

      <section id="compartir-informacion" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          4. Compartir Información
        </h3>
        <p className="text-slate-700 mb-3">
          <strong>NO vendemos su información personal.</strong> Podemos
          compartir su información únicamente en las siguientes circunstancias:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>
            <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a
            operar (hosting, análisis, soporte)
          </li>
          <li>
            <strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o
            autoridades
          </li>
          <li>
            <strong>Protección de derechos:</strong> Para proteger nuestros
            derechos, propiedad o seguridad
          </li>
          <li>
            <strong>Con su consentimiento:</strong> Cuando usted nos autorice
            explícitamente
          </li>
        </ul>
      </section>

      <section id="cookies" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          5. Cookies y Tecnologías de Seguimiento
        </h3>
        <p className="text-slate-700 mb-3">
          Utilizamos cookies y tecnologías similares para:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>
            <strong>Cookies esenciales:</strong> Necesarias para el
            funcionamiento del servicio (sesión, autenticación)
          </li>
          <li>
            <strong>Cookies de rendimiento:</strong> Nos ayudan a entender cómo
            se usa la aplicación
          </li>
          <li>
            <strong>Cookies de funcionalidad:</strong> Recuerdan sus
            preferencias
          </li>
        </ul>
        <p className="text-slate-700">
          Puede gestionar las cookies desde la configuración de su navegador.
          Tenga en cuenta que deshabilitar algunas cookies puede afectar la
          funcionalidad del servicio.
        </p>
      </section>

      <section id="derechos-usuario" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          6. Derechos del Usuario
        </h3>
        <p className="text-slate-700 mb-3">
          De acuerdo con GDPR y CCPA, usted tiene derecho a:
        </p>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <ul className="space-y-3 text-slate-700">
            <li>
              <strong>✓ Derecho de acceso:</strong> Solicitar una copia de sus
              datos personales
            </li>
            <li>
              <strong>✓ Derecho de rectificación:</strong> Corregir información
              inexacta o incompleta
            </li>
            <li>
              <strong>✓ Derecho de eliminación:</strong> Solicitar la
              eliminación de sus datos ("derecho al olvido")
            </li>
            <li>
              <strong>✓ Derecho de portabilidad:</strong> Recibir sus datos en
              formato estructurado
            </li>
            <li>
              <strong>✓ Derecho de oposición:</strong> Oponerse al procesamiento
              de sus datos
            </li>
            <li>
              <strong>✓ Derecho de restricción:</strong> Limitar el
              procesamiento de sus datos
            </li>
            <li>
              <strong>✓ Derecho a no ser discriminado:</strong> Por ejercer sus
              derechos de privacidad (CCPA)
            </li>
          </ul>
        </div>
        <p className="text-slate-700">
          Para ejercer cualquiera de estos derechos, contacte a nuestro equipo
          en{" "}
          <a
            href="mailto:privacy@finanzasapp.com"
            className="text-blue-600 hover:underline"
          >
            privacy@finanzasapp.com
          </a>
          . Responderemos en un plazo de 30 días.
        </p>
      </section>

      <section id="seguridad" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          7. Seguridad de Datos
        </h3>
        <p className="text-slate-700 mb-3">
          Implementamos medidas de seguridad técnicas y organizativas para
          proteger su información:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>Encriptación de datos en tránsito (TLS/SSL)</li>
          <li>Encriptación de datos en reposo</li>
          <li>Contraseñas hasheadas con algoritmos seguros (bcrypt)</li>
          <li>Autenticación de dos factores disponible</li>
          <li>Monitoreo continuo de seguridad</li>
          <li>Auditorías de seguridad regulares</li>
          <li>Acceso restringido a datos personales</li>
        </ul>
      </section>

      <section id="retencion" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          8. Retención de Datos
        </h3>
        <p className="text-slate-700 mb-3">
          Retenemos su información personal mientras:
        </p>
        <ul className="list-disc pl-6 mb-4 text-slate-700 space-y-1">
          <li>Su cuenta esté activa</li>
          <li>Sea necesario para proporcionar el servicio</li>
          <li>Sea requerido por obligaciones legales</li>
          <li>Sea necesario para resolver disputas</li>
        </ul>
        <p className="text-slate-700">
          Cuando elimine su cuenta, eliminaremos sus datos personales en un
          plazo de 90 días, excepto cuando sea requerido por ley mantenerlos.
        </p>
      </section>

      <section id="gdpr-ccpa" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          9. Cumplimiento GDPR y CCPA
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-blue-900 mb-2">
            Para usuarios de la Unión Europea (GDPR):
          </h4>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>Base legal para el procesamiento: Contrato y consentimiento</li>
            <li>
              Transferencias internacionales: Protegidas por cláusulas estándar
            </li>
            <li>Delegado de Protección de Datos: dpo@finanzasapp.com</li>
            <li>
              Derecho a presentar queja ante autoridad de control supervisora
            </li>
          </ul>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-2">
            Para residentes de California (CCPA):
          </h4>
          <ul className="list-disc pl-6 text-slate-700 space-y-1">
            <li>NO vendemos su información personal</li>
            <li>
              Categorías de información recopilada: Identificadores, información
              financiera, actividad en internet
            </li>
            <li>
              Propósito del negocio: Proporcionar servicios de gestión
              financiera
            </li>
            <li>Derecho a optar por no vender información (no aplicable)</li>
          </ul>
        </div>
      </section>

      <section id="menores" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          10. Privacidad de Menores
        </h3>
        <p className="text-slate-700">
          Nuestro servicio no está dirigido a menores de 18 años. No recopilamos
          conscientemente información personal de menores. Si descubrimos que un
          menor nos ha proporcionado información personal, la eliminaremos de
          nuestros sistemas inmediatamente.
        </p>
      </section>

      <section id="cambios" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          11. Cambios a esta Política
        </h3>
        <p className="text-slate-700">
          Podemos actualizar esta Política de Privacidad ocasionalmente.
          Notificaremos cambios significativos por correo electrónico o mediante
          aviso prominente en nuestra aplicación. La fecha de "Última
          actualización" al inicio indica cuándo fue modificada por última vez.
        </p>
      </section>

      <section id="contacto" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          12. Contacto
        </h3>
        <p className="text-slate-700 mb-3">
          Si tiene preguntas sobre esta Política de Privacidad, contacte a:
        </p>
        <div className="bg-slate-100 border border-slate-300 rounded-lg p-4">
          <p className="text-slate-800">
            <strong>FinanzasApp</strong>
            <br />
            Email:{" "}
            <a
              href="mailto:privacy@finanzasapp.com"
              className="text-blue-600 hover:underline"
            >
              privacy@finanzasapp.com
            </a>
            <br />
            Email DPO:{" "}
            <a
              href="mailto:dpo@finanzasapp.com"
              className="text-blue-600 hover:underline"
            >
              dpo@finanzasapp.com
            </a>
            <br />
            Dirección: [Dirección de la empresa]
          </p>
        </div>
      </section>
    </LegalOverlay>
  );
}
