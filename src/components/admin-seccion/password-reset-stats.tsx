import React, { useState, useEffect } from 'react';
import { KeyRound, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { adminApi} from '../../lib/api'; // Ajusta la ruta
import type {ResetStatsResponse, ApiError } from '../../lib/api'; // Ajusta la ruta

// ====================================================================
// Interfaces y Mapeo de Datos
// ====================================================================

interface UserResetBarData {
    id: number;
    label: string; 
    resets: number;
}

export function PasswordResetStats() {
    // 1. Estados para manejar la data
    const [data, setData] = useState<ResetStatsResponse | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 2. Lógica de Carga de Datos (GET /api/admin/stats/password-resets)
    useEffect(() => {
        const fetchStats = async () => {
            setIsLoading(true);
            setIsError(false);
            setError(null);

            try {
                const response = await adminApi.getPasswordResetStats();
                setData(response);
            } catch (err) {
                const apiError = err as ApiError;
                setIsError(true);
                // Captura el mensaje de error o usa un fallback
                setError(apiError.message || `Error (${apiError.statusCode}): Fallo al obtener los datos.`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStats();
    }, []); 
    
    // 3. Procesamiento de Datos para la Gráfica
    const totalResets = data?.totalResets ?? 0;
    
    const userBarData: UserResetBarData[] = data?.byUser
        .map(item => ({
            id: item.userId,
            label: `User ID ${item.userId}`, // Placeholder (idealmente se cruzaría con el nickname)
            resets: item.resetCount,
        }))
        .sort((a, b) => b.resets - a.resets)
        .slice(0, 10) || [];

    // 4. Estados de Renderizado
    if (isLoading) {
        return <div className="text-center py-10 text-slate-600">Cargando estadísticas...</div>;
    }

    if (isError) {
        return <div className="text-center py-10 text-red-600">Error al cargar estadísticas: {error}</div>;
    }


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-slate-900 mb-1">Estadísticas de Reseteo de Contraseña</h2>
                <p className="text-slate-600 text-sm">Monitorea el total de solicitudes de reseteo.</p>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                        <KeyRound className="w-8 h-8 text-purple-600" />
                        <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-purple-700 text-sm mb-1">Total de Reseteos Registrados</p>
                    <p className="text-2xl font-bold text-purple-900">{totalResets}</p>
                </div>
                {/* Otras tarjetas eliminadas por falta de data en el endpoint */}
            </div>

            {/* Charts - Reseteos por Usuario */}
            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200">
                    <h3 className="text-slate-900 mb-4">Top 10 Reseteos por Usuario</h3>
                    <p className="text-slate-600 text-sm mb-4">
                        Conteo de solicitudes de reseteo por identificador de usuario.
                    </p>
                    {userBarData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={userBarData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                <XAxis dataKey="label" stroke="#64748b" />
                                <YAxis stroke="#64748b" />
                                <Tooltip
                                    formatter={(value, name, props) => [value, props.payload.label]}
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        border: '1px solid #e2e8f0',
                                        borderRadius: '8px'
                                    }} 
                                />
                                <Bar dataKey="resets" name="Reseteos" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-center py-10 text-slate-500">No hay datos de reseteo por usuario disponibles.</div>
                    )}
                </div>
            </div>
            {/* Tabla de Reseteos Recientes Eliminada */}
        </div>
    );
}