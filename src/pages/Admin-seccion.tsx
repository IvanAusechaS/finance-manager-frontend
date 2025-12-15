import { useState } from 'react';
import { LayoutDashboard, Users, Clock, KeyRound, Shield, Home, LogOut } from 'lucide-react';
// ⚠️ IMPORTANTE: Necesitas instalar y configurar React Router
import { useNavigate } from 'react-router-dom'; 

// Importaciones de tus componentes de sección
import { GeneralStats } from '../components/admin-seccion/general-stats';
import { LoginHistory } from '../components/admin-seccion/login-history';
import { UserManagement } from '../components/admin-seccion/user-management';
import { PasswordResetStats } from '../components/admin-seccion/password-reset-stats';
import { AdminManagement } from '../components/admin-seccion/admin-management';

type TabType = 'general' | 'logins' | 'users' | 'passwords' | 'admins';

export function AdminPage() {
    const [activeTab, setActiveTab] = useState<TabType>('general');
    
    // 💡 Hook de navegación de React Router
    const navigate = useNavigate(); 
    
    // Suponemos que tienes un servicio de autenticación para el logout
    // import { authService } from '../../lib/auth';

    const tabs = [
        { id: 'general' as TabType, label: 'Estadísticas Generales', icon: LayoutDashboard },
        { id: 'logins' as TabType, label: 'Historial de Logueos', icon: Clock },
        { id: 'users' as TabType, label: 'Gestión de Usuarios', icon: Users },
        { id: 'passwords' as TabType, label: 'Reseteo de Contraseña', icon: KeyRound },
        { id: 'admins' as TabType, label: 'Gestión de Admins', icon: Shield },
    ];

    // --- Lógica de Navegación y Sesión ---
    
    // 1. Ir a la vista principal (Home)
    const handleGoHome = () => {
        // Redirige al path de tu aplicación principal. Por ejemplo: /dashboard o /home
        navigate('/'); 
        console.log('Navegando a la vista principal de la plataforma (/dashboard)...');
    };

    // 2. Cerrar Sesión
    const handleLogout = async () => {
        try {
            // ⚠️ Lógica real de cierre de sesión:
            // 1. Opcional: Llamar a la API de logout si tienes una
            // await authService.logout(); 

            // 2. Limpiar el estado de autenticación (tokens, etc.)
            // localStorage.removeItem('authToken'); 
            
            
            console.log('Sesión cerrada. Redirigiendo a la página de login...');
            
            // 3. Redirigir a la página de login
            navigate('/login'); 
            
        } catch (error) {
            console.error('Error durante el cierre de sesión:', error);
            // Aunque falle el logout de la API, por seguridad forzamos la navegación
            navigate('/login'); 
        }
    };
    // -----------------------------------------------------

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                
                {/* Header y Botones de Acción */}
                <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Panel de Administración</h1>
                        <p className="text-slate-600">Gestiona tu aplicación de finanzas desde aquí</p>
                    </div>
                    
                    <div className="flex gap-3">
                        {/* Botón para ir al Home */}
                        <button
                            onClick={handleGoHome}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors border border-slate-300"
                            title="Ir a la aplicación principal"
                        >
                            <Home className="w-5 h-5" />
                            <span className="hidden sm:inline">Plataforma</span>
                        </button>

                        {/* Botón de Cerrar Sesión */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            title="Cerrar Sesión"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="border-b border-slate-200 bg-slate-50/50">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap border-b-2 transition-colors font-medium ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600 bg-white'
                                                : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'general' && <GeneralStats />}
                        {activeTab === 'logins' && <LoginHistory />}
                        {activeTab === 'users' && <UserManagement />}
                        {activeTab === 'passwords' && <PasswordResetStats />}
                        {activeTab === 'admins' && <AdminManagement />}
                    </div>
                </div>
            </div>
        </div>
    );
}