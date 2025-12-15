import { LegalOverlay } from "./LegalOverlay";

interface LicensesProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function Licenses({ isOpen, onClose }: LicensesProps) {
  return (
    <LegalOverlay
      isOpen={isOpen}
      onClose={onClose}
      title="Licencias y Atribuciones"
      lastUpdated="14 de Noviembre de 2025"
    >
      {/* Introducción */}
      <section className="mb-8">
        <p className="text-slate-700 mb-4">
          FinanzasApp utiliza varias bibliotecas y componentes de código
          abierto. Agradecemos a los autores y mantenedores de estos proyectos
          por su invaluable contribución a la comunidad de desarrolladores.
        </p>
        <p className="text-slate-700">
          A continuación se encuentran las licencias y atribuciones de los
          principales componentes utilizados en este proyecto.
        </p>
      </section>

      {/* Licencia del Proyecto */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Licencia de FinanzasApp
        </h3>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-slate-700 mb-2">
            <strong>Licencia:</strong> Propietaria
          </p>
          <p className="text-slate-700 mb-2">
            <strong>Copyright:</strong> © 2025 FinanzasApp. Todos los derechos
            reservados.
          </p>
          <p className="text-slate-700 text-sm">
            El código fuente de FinanzasApp es propietario y no está disponible
            para uso, modificación o distribución sin autorización expresa.
          </p>
        </div>
      </section>

      {/* Bibliotecas Frontend */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Bibliotecas de Frontend
        </h3>
        <div className="space-y-4">
          {/* React */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">React</h4>
            <p className="text-sm text-slate-600 mb-2">
              Una biblioteca de JavaScript para construir interfaces de usuario
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Versión:</strong> ^18.3.1
              </p>
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
              <p>
                <strong>Autor:</strong> Meta Platforms, Inc.
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://react.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://react.dev/
                </a>
              </p>
            </div>
          </div>

          {/* React Router */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">React Router</h4>
            <p className="text-sm text-slate-600 mb-2">
              Enrutamiento declarativo para React
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Versión:</strong> ^6.x
              </p>
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
              <p>
                <strong>Autor:</strong> Remix Software Inc.
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://reactrouter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://reactrouter.com/
                </a>
              </p>
            </div>
          </div>

          {/* Tailwind CSS */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Tailwind CSS</h4>
            <p className="text-sm text-slate-600 mb-2">
              Un framework CSS utility-first
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Versión:</strong> ^3.4.1
              </p>
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
              <p>
                <strong>Autor:</strong> Tailwind Labs Inc.
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://tailwindcss.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://tailwindcss.com/
                </a>
              </p>
            </div>
          </div>

          {/* Lucide React */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">
              Lucide React (Iconos)
            </h4>
            <p className="text-sm text-slate-600 mb-2">
              Biblioteca de iconos hermosos y consistentes
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Licencia:</strong> ISC License
              </p>
              <p>
                <strong>Autor:</strong> Lucide Contributors
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://lucide.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://lucide.dev/
                </a>
              </p>
            </div>
          </div>

          {/* Shadcn/ui */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">shadcn/ui</h4>
            <p className="text-sm text-slate-600 mb-2">
              Componentes de UI reutilizables construidos con Radix UI y
              Tailwind
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
              <p>
                <strong>Autor:</strong> shadcn
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://ui.shadcn.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://ui.shadcn.com/
                </a>
              </p>
            </div>
          </div>

          {/* Sonner */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">
              Sonner (Notificaciones)
            </h4>
            <p className="text-sm text-slate-600 mb-2">
              Sistema de notificaciones toast para React
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
              <p>
                <strong>Autor:</strong> Emil Kowalski
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bibliotecas Backend */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Bibliotecas de Backend
        </h3>
        <div className="space-y-4">
          {/* Node.js */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Node.js</h4>
            <p className="text-sm text-slate-600 mb-2">
              Entorno de ejecución de JavaScript
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://nodejs.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://nodejs.org/
                </a>
              </p>
            </div>
          </div>

          {/* Express.js */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Express.js</h4>
            <p className="text-sm text-slate-600 mb-2">
              Framework web minimalista para Node.js
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Versión:</strong> ^5.1.0
              </p>
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://expressjs.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://expressjs.com/
                </a>
              </p>
            </div>
          </div>

          {/* Prisma */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">Prisma</h4>
            <p className="text-sm text-slate-600 mb-2">
              ORM de próxima generación para Node.js y TypeScript
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Versión:</strong> ^6.19.0
              </p>
              <p>
                <strong>Licencia:</strong> Apache License 2.0
              </p>
              <p>
                <strong>URL:</strong>{" "}
                <a
                  href="https://www.prisma.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  https://www.prisma.io/
                </a>
              </p>
            </div>
          </div>

          {/* bcrypt */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">bcrypt</h4>
            <p className="text-sm text-slate-600 mb-2">
              Biblioteca para hashing de contraseñas
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Versión:</strong> ^6.0.0
              </p>
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
            </div>
          </div>

          {/* jsonwebtoken */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <h4 className="font-semibold text-slate-900 mb-2">jsonwebtoken</h4>
            <p className="text-sm text-slate-600 mb-2">
              Implementación de JSON Web Tokens
            </p>
            <div className="text-sm text-slate-700 space-y-1">
              <p>
                <strong>Versión:</strong> ^9.0.2
              </p>
              <p>
                <strong>Licencia:</strong> MIT License
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Licencias Open Source */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Texto de Licencias
        </h3>

        {/* MIT License */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-slate-900 mb-2">MIT License</h4>
          <pre className="text-xs text-slate-600 whitespace-pre-wrap">
            {`Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
          </pre>
        </div>

        {/* ISC License */}
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <h4 className="font-semibold text-slate-900 mb-2">ISC License</h4>
          <pre className="text-xs text-slate-600 whitespace-pre-wrap">
            {`Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`}
          </pre>
        </div>
      </section>

      {/* Agradecimientos */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold text-slate-900 mb-3">
          Agradecimientos
        </h3>
        <p className="text-slate-700 mb-3">
          Agradecemos profundamente a toda la comunidad de código abierto por
          hacer posible proyectos como FinanzasApp. Sin el trabajo dedicado de
          miles de desarrolladores en todo el mundo, aplicaciones como esta no
          serían posibles.
        </p>
        <p className="text-slate-700">
          Si crees que hemos omitido alguna atribución o hay un error en esta
          página, por favor contáctanos en{" "}
          <a
            href="mailto:legal@finanzasapp.com"
            className="text-blue-600 hover:underline"
          >
            legal@finanzasapp.com
          </a>
        </p>
      </section>
    </LegalOverlay>
  );
}
