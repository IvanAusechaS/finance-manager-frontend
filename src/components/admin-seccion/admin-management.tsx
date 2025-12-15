import { Shield, Plus, Trash2, Mail, Calendar, Search, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
// Asegúrate de que esta ruta sea correcta para tu servicio API
import { adminApi} from '../../lib/api'; 
import type {LoginRequest, OverviewStatsResponse } from '../../lib/api'; 

// --- Interfaces Ajustadas para el Componente (Frontend) ---

// 1. Tipo de rol simple que se usa para la visualización
type AdminRole = 'Super Admin' | 'Admin';

// 2. Interfaz del Admin tal como es CONSUMIDA en el componente 
interface Admin {
    id: number;
    email: string;
    nickname: string;
    createdAt: string;
    role: AdminRole; // 'Admin' o 'Super Admin'
    addedDate: string; 
    lastLogin: string;
    permissions: string[]; 
}

// Mock de Permisos disponibles (solo visuales)
// Commented out as it's not currently used in the component
// const availablePermissions = [
//     'Gestión de usuarios',
//     'Gestión de admins',
//     'Ver reportes',
//     'Ver estadísticas',
//     'Resetear contraseñas',
//     'Configuración del sistema'
// ];


export function AdminManagement() {
    const [admins, setAdmins] = useState<Admin[]>([]);
    const [stats, setStats] = useState<OverviewStatsResponse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estado para el nuevo Admin 
    const [newAdmin, setNewAdmin] = useState<LoginRequest & { role: AdminRole }>({
        email: '',
        password: '',
        role: 'Admin'
    });

    // --- Lógica de Carga de Datos ---
    // Esta función asume que el backend ya filtra por deletedAt: null
    const fetchAdminsAndStats = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // 1. Obtener lista de usuarios (que incluye admins activos)
            const usersResponse = await adminApi.getUsers();
            
            // Filtrar y mapear los datos del backend al formato del frontend
            const adminUsers: Admin[] = usersResponse.users
                .filter(u => u.role?.name === 'admin' || u.role?.name === 'super_admin')
                .map(u => ({
                    // Mapeo de campos estándar (compatible con UserListItem)
                    id: u.id,
                    email: u.email,
                    nickname: u.nickname,
                    createdAt: u.createdAt,

                    // Campos transformados para el componente
                    role: u.role.name === 'super_admin' ? 'Super Admin' : 'Admin',
                    addedDate: u.createdAt.split('T')[0], 
                    lastLogin: 'Datos de sesión no disponibles', // Placeholder
                    permissions: u.role.name === 'super_admin' ? ['Todos los permisos'] : ['Ver reportes', 'Gestión de usuarios'], // Placeholder
                }));

            setAdmins(adminUsers);

            // 2. Obtener estadísticas (Ejemplo: de hace 30 días a hoy)
            const today = new Date().toISOString().split('T')[0];
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            const statsResponse = await adminApi.getOverviewStats(thirtyDaysAgo, today);
            setStats(statsResponse);

        } catch (err: unknown) {
            console.error("Error fetching admin data:", err);
            setError(err instanceof Error ? err.message : "Error al cargar los datos de administración.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAdminsAndStats();
    }, [fetchAdminsAndStats]);

    // --- Lógica de Acciones ---

    const handleAddAdmin = async () => {
        if (!newAdmin.email || !newAdmin.password) return; 

        try {
            // POST /api/admin/admins (Crear nuevo administrador)
            await adminApi.createAdmin({ 
                email: newAdmin.email, 
                password: newAdmin.password 
            });

            // Recargar la lista y cerrar modal
            setShowAddModal(false);
            setNewAdmin({ email: '', password: '', role: 'Admin' });
            await fetchAdminsAndStats();
        } catch (err: unknown) {
            alert(`Error al agregar administrador: ${err instanceof Error ? err.message : 'Unknown error'}`);
        }
    };

    const handleDeleteAdmin = async (id: number) => {
        const adminToDelete = admins.find(a => a.id === id);
        
        if (adminToDelete?.role === 'Super Admin') {
            alert('No se puede eliminar al Super Admin principal por seguridad.');
            return;
        }

        if (globalThis.confirm(`¿Estás seguro de que deseas eliminar al administrador ${adminToDelete?.email}?`)) {
            try {
                // Llama al endpoint DELETE. El backend se encarga de aplicar deletedAt: new Date()
                await adminApi.deleteAdmin(id); 
                
                // Recargar la lista para mostrar solo los admins activos restantes
                await fetchAdminsAndStats();
            } catch (err: unknown) {
                // Aquí podrías mostrar el mensaje de error si el usuario ya estaba eliminado
                alert(`Error al eliminar administrador: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        }
    };

    // Lógica para filtrar y mostrar el Super Admin si no hay búsqueda
    const superAdmin = admins.find(a => a.role === 'Super Admin');
    const regularAdmins = admins.filter(a => a.role !== 'Super Admin');

    const filteredAdmins = regularAdmins.filter(admin =>
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.nickname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Si hay término de búsqueda, incluimos al Super Admin si coincide, si no, lo dejamos al inicio
    let displayAdmins = admins;
    if (searchTerm.length > 0) {
        const superAdminMatches = superAdmin && (
            superAdmin.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
            superAdmin.nickname.toLowerCase().includes(searchTerm.toLowerCase())
        );
        displayAdmins = superAdminMatches ? [superAdmin, ...filteredAdmins] : filteredAdmins;
    }


    if (isLoading) {
        return <div className="p-8 text-center text-blue-600">Cargando datos de administración...</div>;
    }

    if (error) {
        return <div className="p-8 text-center text-red-600">Error al cargar: {error}</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-slate-900 mb-1">Gestión de Administradores</h2>
                    <p className="text-slate-600 text-sm">Administra los permisos y accesos del equipo</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Agregar Admin
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Buscar administradores por email o nickname..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />
            </div>

            {/* Stats (Usando datos de OverviewStatsResponse) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 text-sm mb-1">Total Usuarios Registrados</p>
                    <p className="text-blue-900 font-bold text-2xl">{stats?.totalUsers ?? '0'}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-700 text-sm mb-1">Cuentas de Administración</p>
                    <p className="text-purple-900 font-bold text-2xl">{stats?.adminCount ?? '0'}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 text-sm mb-1">Transacciones Recientes</p>
                    <p className="text-green-900 font-bold text-2xl">{stats?.transactionsCount ?? '0'}</p>
                </div>
            </div>

            {/* Admins Table */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-slate-700 text-sm">Administrador</th>
                                <th className="px-6 py-3 text-left text-slate-700 text-sm">Rol</th>
                                <th className="px-6 py-3 text-left text-slate-700 text-sm">Permisos (Mock)</th>
                                <th className="px-6 py-3 text-left text-slate-700 text-sm">Fecha de Alta</th>
                                <th className="px-6 py-3 text-left text-slate-700 text-sm">Último Login</th>
                                <th className="px-6 py-3 text-left text-slate-700 text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {displayAdmins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white">
                                                <Shield className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-slate-900 font-medium">{admin.nickname || admin.email.split('@')[0]}</p>
                                                <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                    <Mail className="w-3 h-3" />
                                                    <span>{admin.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            admin.role === 'Super Admin' 
                                                ? 'bg-purple-100 text-purple-700' 
                                                : 'bg-blue-100 text-blue-700'
                                        }`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {admin.permissions.slice(0, 2).map((perm) => (
                                                <span key={perm} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                                    {perm}
                                                </span>
                                            ))}
                                            {admin.permissions.length > 2 && (
                                                <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded">
                                                    +{admin.permissions.length - 2} más
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <Calendar className="w-4 h-4" />
                                            <span className="text-sm">{admin.addedDate}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-600 text-sm">{admin.lastLogin}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDeleteAdmin(admin.id)}
                                            disabled={admin.role === 'Super Admin'}
                                            className={`p-2 rounded-lg transition-colors ${
                                                admin.role === 'Super Admin'
                                                    ? 'text-slate-300 cursor-not-allowed'
                                                    : 'text-red-600 hover:bg-red-50'
                                            }`}
                                            title={admin.role === 'Super Admin' ? 'No se puede eliminar al Super Admin' : 'Eliminar administrador'}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Admin Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white">
                            <h3 className="text-slate-900 font-semibold">Agregar Nuevo Administrador</h3>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-600" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <p className="text-sm text-slate-600">El nuevo administrador deberá cambiar su contraseña al iniciar sesión por primera vez.</p>
                            
                            <div>
                                <label htmlFor="admin-email" className="block text-slate-700 mb-2 font-medium">Email</label>
                                <input
                                    id="admin-email"
                                    type="email"
                                    value={newAdmin.email}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                                    placeholder="correo@ejemplo.com"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="admin-password" className="block text-slate-700 mb-2 font-medium">Contraseña Inicial</label>
                                <input
                                    id="admin-password"
                                    type="password"
                                    value={newAdmin.password}
                                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                    placeholder="Contraseña temporal"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-200 flex justify-end gap-3 sticky bottom-0 bg-white">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddAdmin}
                                disabled={!newAdmin.email || !newAdmin.password}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                            >
                                Agregar Administrador
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}