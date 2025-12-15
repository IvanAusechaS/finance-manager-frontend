import { Search, MoreVertical, Mail, Calendar, Ban, CheckCircle, Loader2, RotateCcw } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { adminApi } from '../../lib/api';
// Asumo que 'toast' es una utilidad de notificación (e.g., react-hot-toast, sonner)
import { toast } from '../../utils/toast'; 
import type { UserListResponse, UserListItem, ApiError } from '../../lib/api'; 

// --- Tipos Adaptados a la API ---

interface User {
    id: number;
    name: string;
    email: string;
    // status: 'active' | 'deleted' | 'admin' representa la eliminación LÓGICA (deletedAt != null)
    status: 'active' | 'deleted' | 'admin'; 
    role: string;
    joinDate: string;
    // Campos simulados
    transactions: number; 
    balance: string;
}

// Función de mapeo (UserListItem a User local)
const mapApiToUser = (item: UserListItem, isDeleted: boolean = false): User => {
    // Nota: El backend de `getUsers` debe devolver solo usuarios **activos** (deletedAt is null)
    // Si tu API devolviera también eliminados, necesitarías agregar un chequeo para `item.deletedAt`.
    
    let status: User['status'] = isDeleted ? 'deleted' : 'active';
    if (item.role.name === 'admin' || item.role.name === 'super_admin') {
        status = 'admin';
    }

    return {
        id: item.id,
        name: item.nickname,
        email: item.email,
        status: status, // Asumimos 'active' si no es admin y no está marcado como eliminado localmente
        role: item.role.name.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase()),
        joinDate: item.createdAt.split('T')[0],
        transactions: Math.floor(Math.random() * 100),
        balance: `$${(Math.random() * 30000).toFixed(2)}`,
    };
};

// --- Componente Principal ---

export function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'deleted' | 'admin'>('all');
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    // 1. Lógica de Carga de Datos
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Asumimos que esta API devuelve TODOS los usuarios, incluidos los eliminados lógicamente (si `deletedAt` es provisto)
            // Si la API solo devuelve activos, deberías simular los 'deleted' para propósitos de la demo.
            const response: UserListResponse = await adminApi.getUsers();
            
            // Para simular que algunos usuarios están "eliminados" (deletedAt), 
            // los marcamos localmente en el mapeo inicial si el backend no los filtra/marca:
            const mappedUsers = response.users.map(user => {
                // Aquí deberías tener una lógica real basada en `user.deletedAt` si existiera en UserListItem
                // Por ahora, solo mapeamos como activos, y la suspensión se hace localmente
                return mapApiToUser(user);
            });
            
            setUsers(mappedUsers);

        } catch (err) {
            const apiError = err as ApiError;
            setError(apiError.message || 'Error al cargar la lista de usuarios.');
            toast.error('Error de API', { description: apiError.message || 'No se pudo obtener la lista.' });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);


    // 2. Lógica de Eliminación Lógica (Suspender)
    const handleDeleteUser = useCallback(async (userId: number, email: string) => {
        if (!window.confirm(`¿Confirmas la ELIMINACIÓN LÓGICA (Suspensión) del usuario ${email}?`)) {
            setOpenMenuId(null);
            return;
        }

        try {
            // Llama al endpoint DELETE. El backend aplica deletedAt = new Date().
            await adminApi.deleteUser(userId); 
            toast.success('Usuario Eliminado/Suspendido', { description: `El usuario ${email} ha sido eliminado lógicamente.` });
            
            // Actualiza el estado local para reflejar la suspensión
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, status: 'deleted' } : user
                )
            );

        } catch (err) {
            const apiError = err as ApiError;
            toast.error('Error al Suspender', { description: apiError.message || 'No se pudo completar la acción.' });
        } finally {
            setOpenMenuId(null);
        }
    }, []);

    // 3. Lógica de Re-activación (asumiendo un endpoint de re-activación, si el backend lo permite)
    const handleRestoreUser = useCallback(async (userId: number, email: string) => {
        // En un sistema real, esta función llamaría a un PUT /api/admin/users/:id/restore 
        // que limpiaría el campo `deletedAt`.
        
        if (!window.confirm(`¿Confirmas la RE-ACTIVACIÓN del usuario ${email}?`)) {
            setOpenMenuId(null);
            return;
        }
        
        try {
            // Ejemplo de llamada a API de restauración (no implementada en adminApi por defecto)
            // await adminApi.restoreUser(userId); 
            
            toast.success('Usuario Re-activado', { description: `El usuario ${email} ha sido re-activado.` });
            
            // Actualiza el estado local para reflejar la re-activación
            setUsers(prevUsers => 
                prevUsers.map(user => 
                    user.id === userId ? { ...user, status: 'active' } : user
                )
            );

        } catch (err) {
            const apiError = err as ApiError;
            // Manejo de errores
            toast.error('Error al Re-activar', { description: apiError.message || 'No se pudo completar la re-activación.' });
        } finally {
            setOpenMenuId(null);
        }
    }, []);


    // 4. Filtrado y Mapeo
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [users, searchTerm, statusFilter]);

    // 5. Funciones de Estilo y Etiquetas
    const getStatusColor = (status: User['status']) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-700';
            case 'admin':
                return 'bg-purple-100 text-purple-700';
            case 'deleted':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-slate-100 text-slate-700';
        }
    };

    const getStatusLabel = (status: User['status']) => {
        switch (status) {
            case 'active':
                return 'Activo';
            case 'admin':
                return 'Admin';
            case 'deleted':
                return 'Eliminado';
            default:
                return 'Desconocido';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                <div>
                    <h2 className="text-slate-900 mb-1">Gestión de Usuarios</h2>
                    <p className="text-slate-600 text-sm">Administra todos los usuarios de la plataforma</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 lg:flex-initial">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-64"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as "all" | "active" | "deleted" | "admin")}
                        className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos los estados</option>
                        <option value="active">Activos</option>
                        <option value="admin">Administradores</option>
                        <option value="deleted">Eliminados</option>
                    </select>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 text-sm mb-1">Total Usuarios</p>
                    <p className="text-blue-900 font-bold text-xl">{isLoading ? '...' : users.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 text-sm mb-1">Activos</p>
                    <p className="text-green-900 font-bold text-xl">{isLoading ? '...' : users.filter(u => u.status === 'active').length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                    <p className="text-purple-700 text-sm mb-1">Administradores</p>
                    <p className="text-purple-900 font-bold text-xl">{isLoading ? '...' : users.filter(u => u.status === 'admin').length}</p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-4">
                    <p className="text-red-700 text-sm mb-1">Eliminados</p>
                    <p className="text-red-900 font-bold text-xl">{isLoading ? '...' : users.filter(u => u.status === 'deleted').length}</p>
                </div>
            </div>

            {/* Manejo de estado de carga y error */}
            {isLoading && (
                <div className="flex justify-center items-center p-8 bg-white border border-slate-200 rounded-lg">
                    <p className="text-blue-600 flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Cargando usuarios...
                    </p>
                </div>
            )}

            {error && !isLoading && (
                <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                    <p>⚠️ Error al cargar la lista de usuarios: {error}</p>
                </div>
            )}

            {/* Users Table */}
            {!isLoading && !error && (
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-slate-700 text-sm">Usuario (ID)</th>
                                    <th className="px-6 py-3 text-left text-slate-700 text-sm">Rol</th>
                                    <th className="px-6 py-3 text-left text-slate-700 text-sm">Fecha de Registro</th>
                                    <th className="px-6 py-3 text-left text-slate-700 text-sm">Transacciones ⚠️</th>
                                    <th className="px-6 py-3 text-left text-slate-700 text-sm">Balance ⚠️</th>
                                    <th className="px-6 py-3 text-left text-slate-700 text-sm">Estado</th>
                                    <th className="px-6 py-3 text-left text-slate-700 text-sm">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {/* Avatar */}
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                    {user.name.split(' ').map(n => n[0]).join('') || user.email.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-medium">{user.name} <span className="text-xs text-slate-500 font-mono">(#{user.id})</span></p>
                                                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                                                        <Mail className="w-3 h-3 flex-shrink-0" />
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600">{user.role}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Calendar className="w-4 h-4" />
                                                <span className="text-sm">{user.joinDate}</span>
                                            </div>
                                        </td>
                                        {/* Advertencia para campos simulados */}
                                        <td className="px-6 py-4">
                                            <span className="text-slate-900">{user.transactions}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-900">{user.balance}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                {getStatusLabel(user.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <button
                                                    onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                                    className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-slate-600" />
                                                </button>
                                                {openMenuId === user.id && (
                                                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                                                        <div className="px-4 py-2 text-xs text-slate-500 border-b">Acciones</div>
                                                        
                                                        {/* Opción de Re-activar */}
                                                        {user.status === 'deleted' && (
                                                            <button
                                                                onClick={() => handleRestoreUser(user.id, user.email)}
                                                                className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2 rounded-t-lg"
                                                            >
                                                                <RotateCcw className="w-4 h-4 text-green-600" />
                                                                Re-activar Usuario
                                                            </button>
                                                        )}
                                                        
                                                        {/* Opción de Suspender (Eliminar Lógico) */}
                                                        {user.status === 'active' && (
                                                            <button
                                                                onClick={() => handleDeleteUser(user.id, user.email)}
                                                                // Deshabilitar la suspensión si es un Admin (por seguridad)
                                                                disabled={user.role === 'admin'}
                                                                className={`w-full px-4 py-2 text-left text-sm ${
                                                                    user.role === 'admin' ? 'text-slate-400 cursor-not-allowed' : 'text-red-700 hover:bg-red-50'
                                                                } flex items-center gap-2`}
                                                            >
                                                                <Ban className="w-4 h-4 text-red-600" />
                                                                Suspender/Eliminar (Lógico)
                                                            </button>
                                                        )}

                                                        {/* Opción para Administradores (solo visual) */}
                                                        {user.status === 'admin' && (
                                                            <button
                                                                disabled
                                                                className="w-full px-4 py-2 text-left text-sm text-purple-700/60 flex items-center gap-2 cursor-not-allowed"
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-purple-600/60" />
                                                                Gestionado en Admin Mgmt
                                                            </button>
                                                        )}

                                                        {/* Opciones Adicionales */}
                                                        <button
                                                            onClick={() => { toast.info('Función no implementada', { description: 'Enviar correo al usuario.' }); setOpenMenuId(null); }}
                                                            className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2 border-t border-slate-100"
                                                        >
                                                            <Mail className="w-4 h-4 text-blue-600" />
                                                            Enviar Correo
                                                        </button>

                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}