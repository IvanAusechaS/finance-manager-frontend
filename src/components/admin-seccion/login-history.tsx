import { Clock, Smartphone, Monitor, Search, User, Zap } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
// Importamos los tipos y la API del servicio
// Importación de VALORES (objetos o funciones)
import { adminApi } from '../../lib/api'; 

// Importación de TIPOS
import type { LoginLogsResponse, UserSessionLog, ApiError } from '../../lib/api';
import { toast } from '../../utils/toast'; 

// Definimos el tipo de dato que usaremos en el estado, que es directamente la interfaz del backend
type LogItem = UserSessionLog;

// 1. Función para inferir el tipo de dispositivo a partir del UserAgent o DeviceId
const getDeviceType = (userAgent: string, deviceId: string) => {
    // Si el backend proporciona un deviceId simple (e.g., 'web', 'android')
    if (deviceId.toLowerCase().includes('android') || deviceId.toLowerCase().includes('ios')) {
        return 'Mobile';
    }
    // Si el backend proporciona el UserAgent completo, podemos hacer una inferencia básica
    if (userAgent.includes('Mobile') || userAgent.includes('Android')) {
        return 'Móvil';
    }
    return 'Escritorio';
};


export function LoginHistory() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  
  // No se usará el filtro de userId por ahora, a menos que se añada un input para ello.
  // const [filterUserId, setFilterUserId] = useState<number | undefined>(undefined); 

  /**
   * Función para cargar los datos de la API
   */
  const fetchLoginLogs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Si implementamos el filtro: const query = filterUserId ? { userId: filterUserId } : undefined;
      const response: LoginLogsResponse = await adminApi.getLoginLogs();
      
      // La respuesta ya está en el formato UserSessionLog
      setLogs(response.logs);
      
    } catch (err) {
      const apiError = err as ApiError;
      const message = apiError.message || 'Error desconocido al cargar los logs.';
      setError(message);
      toast.error('Error de API', { description: message });
    } finally {
      setIsLoading(false);
    }
  }, []); // Sin dependencias de filtro por ahora

  useEffect(() => {
    fetchLoginLogs();
  }, [fetchLoginLogs]);

  // Mapear y filtrar los datos para la tabla
  const displayedLogins = useMemo(() => {
    // Filtrado local basado en los campos existentes (userId, ip, deviceId/userAgent)
    return logs.filter(log =>
      log.userId.toString().includes(searchTerm.toLowerCase()) || // Filtrar por ID de Usuario
      log.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.deviceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userAgent.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [logs, searchTerm]);
  
  // Cálculo de estadísticas basado en el campo 'revoke'
  const activeSessions = logs.filter(l => !l.revoke).length;
  const revokedSessions = logs.filter(l => l.revoke).length;
  const totalLogins = logs.length;

  return (
    <div className="space-y-6">
      
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-slate-900 mb-1">Historial de Sesiones</h2>
          <p className="text-slate-600 text-sm">Registro detallado de los inicios de sesión activos y revocados.</p>
        </div>
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por ID, IP, o Dispositivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-80"
          />
        </div>
      </div>

      {/* Stats Cards - Adaptadas a Revocada/Activa */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-700 text-sm mb-1">Sesiones Activas</p>
          <p className="text-green-900 font-bold text-xl">{isLoading ? '...' : activeSessions}</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm mb-1">Sesiones Revocadas</p>
          <p className="text-red-900 font-bold text-xl">{isLoading ? '...' : revokedSessions}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm mb-1">Total Registros</p>
          <p className="text-blue-900 font-bold text-xl">{isLoading ? '...' : totalLogins}</p>
        </div>
      </div>

      {/* Manejo de estado de carga y error */}
      {isLoading && (
        <div className="flex justify-center items-center p-8 bg-white border border-slate-200 rounded-lg">
          <p className="text-blue-600 flex items-center gap-2">
            <Clock className="w-5 h-5 animate-spin" /> Cargando historial de logueos...
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          <p>⚠️ Error al cargar los datos: {error}</p>
        </div>
      )}

      {/* Login Table - Campos ajustados a la API */}
      {!isLoading && !error && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-slate-700 text-sm">ID Usuario</th>
                  <th className="px-6 py-3 text-left text-slate-700 text-sm">IP</th>
                  <th className="px-6 py-3 text-left text-slate-700 text-sm">Dispositivo / Agente</th>
                  <th className="px-6 py-3 text-left text-slate-700 text-sm">Inicio Sesión</th>
                  <th className="px-6 py-3 text-left text-slate-700 text-sm">Último Uso</th>
                  <th className="px-6 py-3 text-left text-slate-700 text-sm">Estado</th>
                  <th className="px-6 py-3 text-left text-slate-700 text-sm">Acciones</th> {/* Para Revocar si es necesario */}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {displayedLogins.length === 0 ? (
                  <tr>
                      <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                          {searchTerm ? `No se encontraron logs para "${searchTerm}"` : "No hay logs de sesión disponibles."}
                      </td>
                  </tr>
                ) : (
                    displayedLogins.map((log) => {
                        const deviceType = getDeviceType(log.userAgent, log.deviceId);
                        const isRevoked = log.revoke;
                        
                        return (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-700 font-mono">
                                        <User className="w-4 h-4 flex-shrink-0" />
                                        {log.userId}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-600 text-sm font-mono">{log.ip}</span>
                                </td>
                                <td className="px-6 py-4">
                                    {/* Muestra el tipo de dispositivo inferido */}
                                    <div className="flex items-center gap-2 text-slate-600">
                                        {deviceType === 'Móvil' ? (
                                            <Smartphone className="w-4 h-4" />
                                        ) : (
                                            <Monitor className="w-4 h-4" />
                                        )}
                                        <span className="text-sm font-medium">{deviceType}</span>
                                    </div>
                                    <p className="text-slate-400 text-xs truncate w-40" title={log.userAgent}>
                                        {log.userAgent.substring(0, 50)}...
                                    </p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-600 text-sm">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-slate-600 text-sm">
                                        {new Date(log.lastUsedAt).toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            isRevoked 
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}
                                    >
                                        {isRevoked ? 'Revocada' : 'Activa'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {/* Aquí iría la lógica de revocar sesión si es activa */}
                                    {!isRevoked && (
                                        <button className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1">
                                            <Zap className="w-4 h-4" /> Revocar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}