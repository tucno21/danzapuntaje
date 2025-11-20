import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Eliminar',
    cancelText = 'Cancelar',
    type = 'danger'
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const typeStyles = {
        danger: {
            bg: 'bg-red-600 hover:bg-red-700',
            icon: 'text-red-600',
            border: 'border-red-200'
        },
        warning: {
            bg: 'bg-yellow-600 hover:bg-yellow-700',
            icon: 'text-yellow-600',
            border: 'border-yellow-200'
        },
        info: {
            bg: 'bg-blue-600 hover:bg-blue-700',
            icon: 'text-blue-600',
            border: 'border-blue-200'
        }
    };

    const currentStyle = typeStyles[type];

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className={`p-6 border-b ${currentStyle.border}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-opacity-10 ${currentStyle.bg.replace('text-', 'bg-').replace('-600', '-100')}`}>
                                <AlertTriangle className={`w-6 h-6 ${currentStyle.icon}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 text-lg leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 p-6 bg-gray-50 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 px-4 py-3 text-white rounded-lg transition-colors font-medium ${currentStyle.bg}`}
                    >
                        {/* <Check className="w-4 h-4 mr-2" /> */}
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDialog;
