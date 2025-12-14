import { Link, useLocation, useNavigate } from "react-router-dom";
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
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { authApi } from "../lib/api";
import { toast } from "sonner";

const menuItems = [
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

interface SidebarProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log("📱 [Sidebar] Estado:", { isOpen, pathname: location.pathname });

  // Cargar perfil de usuario
  useEffect(() => {
    const loadUserProfile = async () => {
      console.log("👤 [Sidebar] Cargando perfil de usuario");
      try {
        const response = await authApi.getProfile();
        console.log("✅ [Sidebar] Perfil cargado:", response.user.nickname);
        setUser(response.user);
      } catch (error) {
        console.error("❌ [Sidebar] Error al cargar perfil:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate]);

  // Prevenir scroll cuando sidebar está abierto en mobile
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      console.log("🔒 [Sidebar] Scroll bloqueado");
    } else {
      document.body.style.overflow = "";
      console.log("🔓 [Sidebar] Scroll desbloqueado");
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleLogout = async () => {
    console.log("🚪 [Sidebar] Cerrando sesión");
    try {
      await authApi.logout();
      console.log("✅ [Sidebar] Sesión cerrada exitosamente");
      toast.success("Sesión cerrada exitosamente");
      navigate("/login");
    } catch (error) {
      console.error("❌ [Sidebar] Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  const handleMenuItemClick = (path: string, label: string) => {
    console.log(`🔗 [Sidebar] Navegando a: ${path} (${label})`);
    onClose();
  };

  const getInitials = (nickname: string) => {
    return nickname
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Backdrop - Solo visible cuando el sidebar está abierto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => {
            console.log("📱 [Sidebar] Cerrando por backdrop click");
            onClose();
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de navegación"
      >
        {/* Header con logo y botón cerrar */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <Link
            to="/dashboard"
            className="flex items-center gap-3"
            onClick={() => {
              console.log("🏠 [Sidebar] Navegando a dashboard desde logo");
              onClose();
            }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center shadow-md">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold text-slate-900">
                FinanzasApp
              </div>
              <div className="text-xs text-slate-500">Panel de control</div>
            </div>
          </Link>

          <button
            onClick={() => {
              console.log("❌ [Sidebar] Cerrando sidebar");
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => handleMenuItemClick(item.path, item.label)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-50 text-blue-700 font-medium shadow-sm"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }
                `}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          {isLoading ? (
            <div className="flex items-center gap-3 px-4 py-3 mb-3">
              <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse" />
              <div className="flex-1 min-w-0">
                <div className="h-4 bg-slate-200 rounded animate-pulse mb-2" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3 px-4 py-3 mb-3 rounded-lg bg-white border border-slate-200">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
                {getInitials(user.nickname)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {user.nickname}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  {user.email}
                </div>
              </div>
            </div>
          ) : null}

          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-slate-600 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Cerrar sesión</span>
          </Button>
        </div>
      </div>
    </>
  );
}
