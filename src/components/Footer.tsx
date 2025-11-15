import { Wallet } from "lucide-react";

export function Footer() {
  return (
    <footer className="px-4 py-12 bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Wallet className="w-6 h-6" />
              <span>FinanzasApp</span>
            </div>
            <p className="text-sm">
              Tu compañero de confianza para la gestión inteligente de finanzas personales.
            </p>
          </div>

          <div>
            <div className="text-white mb-4">Producto</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Características
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Precios
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Seguridad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Actualizaciones
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white mb-4">Empresa</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Carreras
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white mb-4">Legal</div>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cookies
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Licencias
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-sm text-center md:text-left">
          <p>© 2025 FinanzasApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
