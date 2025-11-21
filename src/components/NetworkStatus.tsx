import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface NetworkStatusProps {
    className?: string;
}

const NetworkStatus: React.FC<NetworkStatusProps> = ({ className = '' }) => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showOfflineMessage, setShowOfflineMessage] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowOfflineMessage(false);
            console.log('Aplicación ahora está online');
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowOfflineMessage(true);
            console.log('Aplicación ahora está offline');
        };

        // Escuchar eventos de conexión
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Verificar estado inicial
        if (!navigator.onLine) {
            setShowOfflineMessage(true);
        }

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleRefresh = () => {
        window.location.reload();
    };

    if (isOnline && !showOfflineMessage) {
        return null;
    }

    return (
        <div className={`fixed top-4 right-4 z-50 ${className}`}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 ${isOnline
                    ? 'bg-green-50 border-green-200 text-green-800'
                    : 'bg-orange-50 border-orange-200 text-orange-800'
                }`}>
                <div className="flex items-center gap-2">
                    {isOnline ? (
                        <>
                            <Wifi className="w-5 h-5" />
                            <span className="font-medium">Conectado</span>
                        </>
                    ) : (
                        <>
                            <WifiOff className="w-5 h-5" />
                            <span className="font-medium">Modo Offline</span>
                        </>
                    )}
                </div>

                {!isOnline && (
                    <>
                        <span className="text-sm opacity-75">Los datos se guardarán localmente</span>
                        <button
                            onClick={handleRefresh}
                            className="p-1 hover:bg-orange-100 rounded transition-colors"
                            title="Recargar página"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default NetworkStatus;
