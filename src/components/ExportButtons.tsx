import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, FileJson, Printer, Upload, Trash2 } from 'lucide-react';
import { useDanzasStore } from '../store/danzasStore';
import {
    exportToExcel,
    exportToCSV,
    exportToJSON,
    exportRankingToPDF,
    // importFromJSON
} from '../utils/exportData';
import ConfirmDialog from './ConfirmDialog';

const ExportButtons: React.FC = () => {
    const { danzas, config, getRankingGeneral, clearAllDanzas, addToast } = useDanzasStore();
    const [isExporting, setIsExporting] = useState<string | null>(null);
    const [confirmDialog, setConfirmDialog] = useState<{
        isOpen: boolean;
        type: 'danger' | 'warning' | 'info';
        title: string;
        message: string;
        onConfirm: () => void;
    }>({
        isOpen: false,
        type: 'danger',
        title: '',
        message: '',
        onConfirm: () => { }
    });

    const rankingGeneral = getRankingGeneral();

    const handleExportExcel = async () => {
        setIsExporting('excel');
        try {
            await exportToExcel(danzas, config, 'ranking-general-danzas');
            addToast({
                type: 'success',
                message: 'Archivo Excel exportado correctamente'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Error al exportar Excel'
            });
        } finally {
            setIsExporting(null);
        }
    };

    const handleExportCSV = async () => {
        setIsExporting('csv');
        try {
            await exportToCSV(danzas, config, 'ranking-general-danzas');
            addToast({
                type: 'success',
                message: 'Archivo CSV exportado correctamente'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Error al exportar CSV'
            });
        } finally {
            setIsExporting(null);
        }
    };

    const handleExportPDF = async () => {
        setIsExporting('pdf');
        try {
            await exportRankingToPDF(rankingGeneral, config, 'ranking-general-danzas');
            addToast({
                type: 'success',
                message: 'PDF exportado correctamente'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Error al exportar PDF'
            });
        } finally {
            setIsExporting(null);
        }
    };

    const handleExportJSON = async () => {
        setIsExporting('json');
        try {
            await exportToJSON(danzas, config, 'backup-completo-danzas');
            addToast({
                type: 'success',
                message: 'Archivo JSON exportado correctamente'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: 'Error al exportar JSON'
            });
        } finally {
            setIsExporting(null);
        }
    };

    const handleImportJSON = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsExporting('import');
        try {
            // const data = await importFromJSON(file);

            // Aquí deberías implementar la lógica para importar los datos
            // Por ahora solo mostramos un mensaje
            addToast({
                type: 'success',
                message: 'Importación completada (funcionalidad en desarrollo)'
            });
        } catch (error) {
            addToast({
                type: 'error',
                message: error instanceof Error ? error.message : 'Error al importar archivo'
            });
        } finally {
            setIsExporting(null);
            // Limpiar el input
            event.target.value = '';
        }
    };

    const handleClearAll = () => {
        if (danzas.length === 0) {
            addToast({
                type: 'warning',
                message: 'No hay danzas para eliminar'
            });
            return;
        }

        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'Eliminar Todas las Danzas',
            message: `¿Está seguro de eliminar todas las ${danzas.length} danzas registradas? Esta acción no se puede deshacer y eliminará permanentemente todos los datos.`,
            onConfirm: clearAllDanzas
        });
    };

    if (danzas.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="text-center">
                    <Download className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No hay datos para exportar
                    </h3>
                    <p className="text-gray-500">
                        Registra algunas danzas para poder exportar los resultados
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                    <Download className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Exportar Resultados</h2>
            </div>

            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-200">
                    <div className="text-2xl font-bold text-blue-600">{danzas.length}</div>
                    <div className="text-sm text-blue-700">Total Danzas</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                        {rankingGeneral[0]?.danza.total || 0}
                    </div>
                    <div className="text-sm text-green-700">Puntaje Más Alto</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-200">
                    <div className="text-2xl font-bold text-purple-600">
                        {rankingGeneral[rankingGeneral.length - 1]?.danza.total || 0}
                    </div>
                    <div className="text-sm text-purple-700">Puntaje Más Bajo</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center border border-orange-200">
                    <div className="text-2xl font-bold text-orange-600">
                        {(danzas.reduce((sum, d) => sum + d.total, 0) / danzas.length).toFixed(1)}
                    </div>
                    <div className="text-sm text-orange-700">Promedio</div>
                </div>
            </div>

            {/* Botones de exportación */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                    onClick={handleExportExcel}
                    disabled={isExporting !== null}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting === 'excel' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Exportando...
                        </>
                    ) : (
                        <>
                            <FileSpreadsheet className="w-5 h-5" />
                            Exportar a Excel
                        </>
                    )}
                </button>

                <button
                    onClick={handleExportCSV}
                    disabled={isExporting !== null}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting === 'csv' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Exportando...
                        </>
                    ) : (
                        <>
                            <FileText className="w-5 h-5" />
                            Exportar a CSV
                        </>
                    )}
                </button>

                <button
                    onClick={handleExportPDF}
                    disabled={isExporting !== null}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting === 'pdf' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Exportando...
                        </>
                    ) : (
                        <>
                            <Printer className="w-5 h-5" />
                            Exportar a PDF
                        </>
                    )}
                </button>

                <button
                    onClick={handleExportJSON}
                    disabled={isExporting !== null}
                    className="flex items-center justify-center gap-3 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isExporting === 'json' ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Exportando...
                        </>
                    ) : (
                        <>
                            <FileJson className="w-5 h-5" />
                            Exportar a JSON
                        </>
                    )}
                </button>
            </div>

            {/* Importar y Limpiar */}
            <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Importar JSON */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Importar Datos (JSON)
                        </label>
                        <label className="flex items-center justify-center gap-3 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium cursor-pointer border-2 border-dashed border-gray-300">
                            {isExporting === 'import' ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                                    Importando...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-5 h-5" />
                                    Seleccionar Archivo JSON
                                </>
                            )}
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImportJSON}
                                disabled={isExporting !== null}
                                className="hidden"
                            />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                            Importa datos previamente exportados
                        </p>
                    </div>

                    {/* Limpiar todo */}
                    <div>
                        <button
                            onClick={handleClearAll}
                            disabled={isExporting !== null}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium border border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 className="w-5 h-5" />
                            Eliminar Todas las Danzas
                        </button>
                        <p className="text-xs text-gray-500 mt-2">
                            Elimina permanentemente todos los datos
                        </p>
                    </div>
                </div>
            </div>

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type={confirmDialog.type}
            />
        </div>
    );
};

export default ExportButtons;
