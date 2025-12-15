import { TrendingUp, Users, Shield, ArrowUpRight, ArrowDownRight, Loader2, Calendar } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../lib/api'; 
import { toast } from '../../utils/toast'; 
import type { OverviewStatsResponse, ApiError } from '../../lib/api';

// --- FUNCIONES DE UTILIDAD DE FECHAS ---

/** Obtiene la fecha de hoy en formato YYYY-MM-DD */
const getToday = () => new Date().toISOString().split('T')[0];

/** Obtiene el primer día del mes actual en formato YYYY-MM-DD */
const getFirstDayOfCurrentMonth = () => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split('T')[0];
};

/** Formatea un número con separador de miles */
const formatNumber = (num: number) => new Intl.NumberFormat('es-ES').format(num);

// Datos simulados para porcentajes de cambio (no tenemos datos históricos reales)
// Mantenemos esto como MOCK para el aspecto visual de la tarjeta
const SIMULATED_TRENDS = {
    transactions: { change: 12.5, positive: true },
    users: { change: 8.3, positive: true },
    admins: { change: 2.1, positive: false },
};

export function GeneralStats() {
    const [stats, setStats] = useState<OverviewStatsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Rango de fechas por defecto: Mes actual
    const [dateFrom, setDateFrom] = useState(getFirstDayOfCurrentMonth());
    const [dateTo, setDateTo] = useState(getToday());

    const fetchOverviewStats = useCallback(async (from: string, to: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response: OverviewStatsResponse = await adminApi.getOverviewStats(from, to);
            setStats(response);
        } catch (err) {
            const apiError = err as ApiError;
            const message = apiError.message || 'Error desconocido al cargar las estadísticas.';
            setError(message);
            toast.error('Error de API', { description: message });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOverviewStats(dateFrom, dateTo);
    }, [fetchOverviewStats, dateFrom, dateTo]);

    return (
        <div className="space-y-6">
            
            {/* Título y Selector de Periodo */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">📊 Resumen General de la Plataforma</h2>
                    <p className="text-slate-600 text-sm mt-1">
                        Datos consolidados del periodo: **{dateFrom}** al **{dateTo}**
                    </p>
                </div>
                
                {/* Selector de Fechas (Placeholder funcional) */}
                <div className="flex items-center gap-2 p-2 border border-slate-300 rounded-lg bg-white shadow-sm">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <input 
                        type="date" 
                        value={dateFrom} 
                        onChange={(e) => setDateFrom(e.target.value)}
                        className="text-sm focus:outline-none bg-transparent"
                    />
                    <span className="text-slate-500">—</span>
                    <input 
                        type="date" 
                        value={dateTo} 
                        onChange={(e) => setDateTo(e.target.value)}
                        className="text-sm focus:outline-none bg-transparent"
                    />
                </div>
            </div>

            {/* Manejo de estado de carga y error */}
            {isLoading && (
                <div className="flex justify-center items-center p-8 bg-white border border-slate-200 rounded-xl">
                    <p className="text-blue-600 flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" /> Cargando estadísticas generales...
                    </p>
                </div>
            )}

            {error && !isLoading && (
                <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                    <p>⚠️ Error al cargar las estadísticas principales: {error}</p>
                </div>
            )}

            {/* Stats Cards - Llenadas con datos del backend */}
            {!isLoading && stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* 1. Total de Transacciones */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-blue-500 rounded-lg">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-green-600`}>
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm">+{SIMULATED_TRENDS.transactions.change}%</span>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">Total de Transacciones</p>
                        <p className="text-slate-900 text-3xl font-bold">{formatNumber(stats.transactionsCount)}</p>
                        <p className="text-slate-500 text-xs mt-2">En el periodo seleccionado</p>
                    </div>

                    {/* 2. Total de Usuarios */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-purple-500 rounded-lg">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-green-600`}>
                                <ArrowUpRight className="w-4 h-4" />
                                <span className="text-sm">+{SIMULATED_TRENDS.users.change}%</span>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">Total de Usuarios</p>
                        <p className="text-slate-900 text-3xl font-bold">{formatNumber(stats.totalUsers)}</p>
                        <p className="text-slate-500 text-xs mt-2">Usuarios registrados</p>
                    </div>

                    {/* 3. Total de Admins */}
                    <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-emerald-500 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div className={`flex items-center gap-1 text-red-600`}>
                                <ArrowDownRight className="w-4 h-4" />
                                <span className="text-sm">-{SIMULATED_TRENDS.admins.change}%</span>
                            </div>
                        </div>
                        <p className="text-slate-600 text-sm mb-1">Total de Admins</p>
                        <p className="text-slate-900 text-3xl font-bold">{formatNumber(stats.adminCount)}</p>
                        <p className="text-slate-500 text-xs mt-2">Administradores activos</p>
                    </div>
                </div>
            )}
        </div>
    );
}