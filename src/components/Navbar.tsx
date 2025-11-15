import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { TrendingUp, Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./Navbar.module.scss";

/**
 * Navbar component
 * Barra de navegación principal de la aplicación
 * Incluye logo, enlaces de navegación y botones de autenticación
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Solo mostrar en la landing page
  const isLandingPage = location.pathname === "/";

  if (!isLandingPage) {
    return null;
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.header}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <TrendingUp />
            </div>
            <span className={styles.logoText}>Finance Manager</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <button onClick={() => scrollToSection("features")} className={styles.navLink}>
              Características
            </button>
            <button onClick={() => scrollToSection("benefits")} className={styles.navLink}>
              Beneficios
            </button>
            <button onClick={() => scrollToSection("how-it-works")} className={styles.navLink}>
              Cómo funciona
            </button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className={styles.authButtons}>
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Registrarse</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <button onClick={() => scrollToSection("features")} className={styles.mobileNavLink}>
              Características
            </button>
            <button onClick={() => scrollToSection("benefits")} className={styles.mobileNavLink}>
              Beneficios
            </button>
            <button
              onClick={() => scrollToSection("how-it-works")}
              className={styles.mobileNavLink}
            >
              Cómo funciona
            </button>

            <div className={styles.mobileAuthSection}>
              <Link to="/login">
                <Button variant="ghost" size="sm" className={styles.mobileAuthButton}>
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className={styles.mobileAuthButton}>
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
