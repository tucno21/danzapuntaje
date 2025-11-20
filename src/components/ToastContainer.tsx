import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useDanzasStore } from '../store/danzasStore';

const ToastContainer: React.FC = () => {
    const { toasts, removeToast } = useDanzasStore();

    useEffect(() => {
        // Auto-eliminar toasts después de 5 segundos
        const timers = toasts.map(toast =>
            setTimeout(() => removeToast(toast.id), 5000)
        );

        return () => timers.forEach(timer => clearTimeout(timer));
    }, [toasts, removeToast]);

    const getIcon = (type: string) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case 'info':
            default:
                return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const getToastStyles = (type: string) => {
        switch (type) {
            case 'success':
                return 'border-green-200 bg-green-50';
            case 'error':
                return 'border-red-200 bg-red-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            case 'info':
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`
            flex items-start gap-3 p-4 rounded-lg border shadow-lg
            transform transition-all duration-300 ease-in-out
            animate-in slide-in-from-right-full
            ${getToastStyles(toast.type)}
          `}
                >
                    <div className="shrink-0 mt-0.5">
                        {getIcon(toast.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                            {toast.message}
                        </p>
                    </div>

                    <button
                        onClick={() => removeToast(toast.id)}
                        className="shrink-0 ml-2 p-1 rounded-md hover:bg-black/10 transition-colors"
                        aria-label="Cerrar notificación"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
