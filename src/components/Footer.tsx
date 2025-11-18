import { Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { PrivacyPolicy } from "./legal/PrivacyPolicy";
import { TermsOfService } from "./legal/TermsOfService";
import { CookiePolicy } from "./legal/CookiePolicy";
import { Licenses } from "./legal/Licenses";

export function Footer() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showCookies, setShowCookies] = useState(false);
  const [showLicenses, setShowLicenses] = useState(false);

  return (
    <footer className="px-4 py-12 bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <Wallet className="w-6 h-6" />
              <span className="font-bold text-lg">FinanzasApp</span>
            </div>
            <p className="text-sm">
              Tu compañero de confianza para la gestión inteligente de finanzas
              personales.
            </p>
          </div>

          <div>
            <div className="text-white font-semibold mb-4">Producto</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/dashboard"
                  className="hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categorías
                </Link>
              </li>
              <li>
                <Link
                  to="/accounts"
                  className="hover:text-white transition-colors"
                >
                  Cuentas
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="hover:text-white transition-colors"
                >
                  Gestión de Cuenta
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold mb-4">Recursos</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/articles"
                  className="hover:text-white transition-colors"
                >
                  Artículos
                </Link>
              </li>
              <li>
                <Link
                  to="/#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="hover:text-white transition-colors"
                >
                  Crear cuenta
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="hover:text-white transition-colors"
                >
                  Iniciar sesión
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-white font-semibold mb-4">Legal</div>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Términos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowCookies(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowLicenses(true)}
                  className="hover:text-white transition-colors text-left"
                >
                  Licencias
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-sm text-center md:text-left">
          <p>© 2025 FinanzasApp. Todos los derechos reservados.</p>
        </div>
      </div>

      {/* Overlays Legales */}
      <PrivacyPolicy
        isOpen={showPrivacy}
        onClose={() => setShowPrivacy(false)}
      />
      <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <CookiePolicy
        isOpen={showCookies}
        onClose={() => setShowCookies(false)}
      />
      <Licenses isOpen={showLicenses} onClose={() => setShowLicenses(false)} />
    </footer>
  );
}
