import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  LayoutDashboard,
  Calendar,
  TrendingUp,
  LogOut,
  Wallet,
  FolderKanban,
  User,
  Tag,
  ArrowRightLeft,
  BarChart3,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { authApi } from "../lib/api";
import { toast } from "../utils/toast";

const dashboardMenuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "Calendario", path: "/calendar" },
  { icon: ArrowRightLeft, label: "Transacciones", path: "/transactions" },
  { icon: FolderKanban, label: "Categorías", path: "/categories" },
  { icon: Wallet, label: "Cuentas", path: "/accounts" },
  { icon: Tag, label: "Etiquetas", path: "/tags" },
  { icon: BarChart3, label: "Estadísticas", path: "/statistics" },
  { icon: TrendingUp, label: "Reportes", path: "/reports" },
  { icon: User, label: "Gestión de Cuenta", path: "/profile" },
];

interface UserProfile {
  id: number;
  email: string;
  nickname: string;
}

// Helper function: Get user initials from nickname
const getInitials = (nickname: string) => {
  return nickname
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

// Helper function: Render user menu dropdown
const renderUserMenu = (
  user: UserProfile | null,
  isLoading: boolean,
  isUserMenuOpen: boolean,
  setIsUserMenuOpen: (value: boolean) => void,
  handleLogout: () => void
) => {
  if (isLoading) {
    return <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse" />;
  }

  if (!user) return null;

  return (
    <div className="user-menu-container relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-md">
          {getInitials(user.nickname)}
        </div>
        <div className="hidden md:block text-left">
          <div className="text-sm font-medium text-slate-900 truncate max-w-[120px]">
            {user.nickname}
          </div>
          <div className="text-xs text-slate-500 truncate max-w-[120px]">
            {user.email}
          </div>
        </div>
        <ChevronDown
          className={`hidden md:block w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isUserMenuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 overflow-hidden z-50">
          <div className="md:hidden px-4 py-3 border-b border-slate-100">
            <div className="text-sm font-medium text-slate-900 truncate">
              {user.nickname}
            </div>
            <div className="text-xs text-slate-500 truncate">
              {user.email}
            </div>
          </div>
          <Link
            to="/profile"
            onClick={() => setIsUserMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <User className="w-4 h-4" />
            <span>Mi Perfil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Helper function: Render dashboard mobile menu
const renderDashboardMobileMenu = (
  isMenuOpen: boolean,
  setIsMenuOpen: (value: boolean) => void,
  location: ReturnType<typeof useLocation>
) => {
  if (!isMenuOpen) return null;

  return (
    <>
      <button
        className="lg:hidden fixed inset-0 top-16 bg-black/20 z-40"
        onClick={() => setIsMenuOpen(false)}
        aria-label="Cerrar menú"
        tabIndex={0}
      />
      <div className="lg:hidden fixed top-16 right-4 w-56 bg-white rounded-lg shadow-xl border border-slate-200 py-2 overflow-hidden z-50 max-h-[calc(100vh-5rem)] overflow-y-auto">
        {dashboardMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};

// Helper function: Render authentication buttons
const renderAuthButtons = (
  isAuthenticated: boolean,
  isLoading: boolean,
  handleLogout: () => void,
  isMobile = false
) => {
  if (isLoading) return null;

  const buttonClasses = isMobile ? "w-full justify-start" : "";

  if (isAuthenticated) {
    return (
      <>
        <Link to="/dashboard">
          <Button variant="ghost" size="sm" className={buttonClasses}>
            <User className="w-4 h-4 mr-2" />
            Mi Cuenta
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className={buttonClasses}
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Cerrar Sesión
        </Button>
      </>
    );
  }

  return (
    <>
      <Link to="/login">
        <Button variant="ghost" size="sm" className={buttonClasses}>
          Iniciar Sesión
        </Button>
      </Link>
      <Link to="/register">
        <Button size="sm" className={isMobile ? "w-full" : ""}>
          Registrarse
        </Button>
      </Link>
    </>
  );
};

// Helper function: Render landing page mobile menu
const renderLandingMobileMenu = (
  isMenuOpen: boolean,
  isAuthenticated: boolean,
  isLoading: boolean,
  setIsMenuOpen: (value: boolean) => void,
  scrollToSection: (sectionId: string) => void,
  handleLogout: () => void
) => {
  if (!isMenuOpen) return null;

  return (
    <div className="min-[480px]:hidden border-t border-slate-200 py-4 space-y-2">
      <Link
        to="/articles"
        className="block px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        onClick={() => setIsMenuOpen(false)}
      >
        Artículos
      </Link>
      <button
        onClick={() => scrollToSection("how-it-works")}
        className="w-full text-left px-4 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
      >
        Cómo funciona
      </button>

      <div className="pt-4 border-t border-slate-200 space-y-2">
        {renderAuthButtons(isAuthenticated, isLoading, handleLogout, true)}
      </div>
    </div>
  );
};

/**
 * Navbar component - Doble función:
 * 1. Landing page: barra simple con login/register
 * 2. Dashboard: navbar completo con menú hamburguesa y perfil de usuario
 */
export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Determinar si estamos en dashboard o landing
  const isDashboardRoute = [
    "/dashboard",
    "/calendar",
    "/transactions",
    "/categories",
    "/accounts",
    "/tags",
    "/statistics",
    "/reports",
    "/profile",
  ].includes(location.pathname);

  const isLandingRoute = [
    "/",
    "/login",
    "/register",
    "/signup",
    "/articles",
  ].includes(location.pathname);

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, [location.pathname]);

  const checkAuth = async () => {
    try {
      const response = await authApi.getProfile();
      setUser(response.user);
      setIsAuthenticated(true);
    } catch {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Cerrar menús al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMenuOpen && isDashboardRoute) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, isDashboardRoute]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      toast.success("Sesión cerrada correctamente");
      navigate("/");
    } catch (error) {
      console.error("❌ [Navbar] Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  // DASHBOARD NAVBAR
  if (isDashboardRoute && isAuthenticated) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full bg-white border-b border-slate-200 shadow-sm z-50">
        <div className="max-w-full mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              {/* Cargamos el favicon.svg */}
              <img
                src="../../favicon.svg"
                alt="Finanz logo"
                className="w-6 h-6"
              />

              <span className="hidden sm:block text-base font-semibold text-slate-900">
                Finanz
              </span>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Hamburger Button - Solo visible en mobile/tablet */}
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
              }}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-slate-700" />
              ) : (
                <Menu className="w-5 h-5 text-slate-700" />
              )}
            </button>

            {/* User Profile */}
            {renderUserMenu(
              user,
              isLoading,
              isUserMenuOpen,
              setIsUserMenuOpen,
              handleLogout
            )}
          </div>
        </div>

        {/* Mobile Menu - Aparece desde la derecha como el user menu */}
        {renderDashboardMobileMenu(isMenuOpen, setIsMenuOpen, location)}
      </header>
    );
  }

  // LANDING PAGE NAVBAR
  if (isLandingRoute) {
    const scrollToSection = (sectionId: string) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsMenuOpen(false);
      }
    };

    return (
      <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-slate-900">
                Finance Manager
              </span>
            </Link>

            {/* Auth Buttons - Hide on mobile (<480px), show from 480px+ */}
            <div className="hidden min-[480px]:flex items-center gap-3">
              {renderAuthButtons(isAuthenticated, isLoading, handleLogout)}
            </div>

            {/* Mobile Menu Button - Solo mostrar si hay algo que mostrar en el menú */}
            {!isLoading && (
              <button
                className="min-[480px]:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            )}
          </div>

          {/* Mobile Menu */}
          {renderLandingMobileMenu(
            isMenuOpen,
            isAuthenticated,
            isLoading,
            setIsMenuOpen,
            scrollToSection,
            handleLogout
          )}
        </div>
      </nav>
    );
  }

  // No mostrar navbar en otras rutas
  return null;
}
