import React, { useState, useMemo } from 'react';
import { Trophy, Edit, Trash2, Search, Filter, ChevronUp, ChevronDown, X } from 'lucide-react';
import { useDanzasStore } from '../store/danzasStore';
import { obtenerMedalla, } from '../utils/calculations';
import type { Danza } from '../types';
import ConfirmDialog from './ConfirmDialog';

interface TablaDanzasProps {
    titulo: string;
    danzas: Danza[];
    mostrarEdicion?: boolean;
    grupoFiltrado?: string;
}

const TablaDanzas: React.FC<TablaDanzasProps> = ({
    titulo,
    danzas,
    mostrarEdicion = false,
    grupoFiltrado
}) => {
    const { config, deleteDanza, updateDanza } = useDanzasStore();
    const [busqueda, setBusqueda] = useState('');
    const [ordenCampo, setOrdenCampo] = useState<keyof Danza>('total');
    const [ordenDireccion, setOrdenDireccion] = useState<'asc' | 'desc'>('desc');
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editandoDanza, setEditandoDanza] = useState<Partial<Danza>>({});
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

    // Filtrar y ordenar danzas
    const danzasFiltradas = useMemo(() => {
        let filtradas = [...danzas];

        // Aplicar búsqueda
        if (busqueda) {
            const busquedaLower = busqueda.toLowerCase();
            filtradas = filtradas.filter(danza =>
                danza.nombre.toLowerCase().includes(busquedaLower) ||
                danza.gradoSeccion.toLowerCase().includes(busquedaLower) ||
                danza.grupo.toLowerCase().includes(busquedaLower) ||
                danza.total.toString().includes(busquedaLower)
            );
        }

        // Aplicar ordenamiento
        filtradas.sort((a, b) => {
            const valorA = a[ordenCampo];
            const valorB = b[ordenCampo];

            if (typeof valorA === 'string' && typeof valorB === 'string') {
                return ordenDireccion === 'asc'
                    ? valorA.localeCompare(valorB)
                    : valorB.localeCompare(valorA);
            }

            if (typeof valorA === 'number' && typeof valorB === 'number') {
                return ordenDireccion === 'asc' ? valorA - valorB : valorB - valorA;
            }

            return 0;
        });

        return filtradas;
    }, [danzas, busqueda, ordenCampo, ordenDireccion]);

    const handleOrdenar = (campo: keyof Danza) => {
        if (ordenCampo === campo) {
            setOrdenDireccion(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setOrdenCampo(campo);
            setOrdenDireccion('desc');
        }
    };

    const handleEditar = (danza: Danza) => {
        setEditandoId(danza.id);
        setEditandoDanza({ ...danza });
    };

    const handleGuardarEdicion = () => {
        if (!editandoId || !editandoDanza) return;

        const validado = {
            ...editandoDanza,
            nombre: editandoDanza.nombre?.trim() || '',
            gradoSeccion: editandoDanza.gradoSeccion?.trim() || '',
            grupo: editandoDanza.grupo?.trim() || ''
        } as Danza;

        updateDanza(editandoId, validado);
        setEditandoId(null);
        setEditandoDanza({});
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setEditandoDanza({});
    };

    const handleEliminar = (id: string, nombre: string) => {
        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'Eliminar Danza',
            message: `¿Está seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            onConfirm: () => deleteDanza(id)
        });
    };

    const obtenerIconoOrden = (campo: keyof Danza) => {
        if (ordenCampo !== campo) return null;

        return ordenDireccion === 'asc' ? (
            <ChevronUp className="w-4 h-4 inline-block ml-1" />
        ) : (
            <ChevronDown className="w-4 h-4 inline-block ml-1" />
        );
    };

    const getPositionColor = (index: number) => {
        const posicion = index + 1;
        switch (posicion) {
            case 1: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 2: return 'text-gray-600 bg-gray-50 border-gray-200';
            case 3: return 'text-orange-600 bg-orange-50 border-orange-200';
            default: return 'text-gray-700 bg-white border-gray-200';
        }
    };

    if (danzas.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                    <Trophy className="w-12 h-12 text-gray-300" />
                    <div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">{titulo}</h3>
                        <p className="text-gray-500">
                            {grupoFiltrado ? `No hay danzas registradas en ${grupoFiltrado}` : 'No hay danzas registradas aún'}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Encabezado */}
            <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Trophy className="w-6 h-6" />
                        <h2 className="text-2xl font-bold">{titulo}</h2>
                    </div>
                    {grupoFiltrado && (
                        <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                            {grupoFiltrado}
                        </div>
                    )}
                </div>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por nombre, grado, grupo o puntaje..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Filter className="w-4 h-4" />
                        <span>{danzasFiltradas.length} de {danzas.length} danzas</span>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                #
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleOrdenar('nombre')}
                            >
                                Nombre {obtenerIconoOrden('nombre')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleOrdenar('gradoSeccion')}
                            >
                                Grado {obtenerIconoOrden('gradoSeccion')}
                            </th>
                            <th
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleOrdenar('grupo')}
                            >
                                Grupo {obtenerIconoOrden('grupo')}
                            </th>
                            {config.jurados.map((_jurado, index) => (
                                <th key={index} className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    J{index + 1}
                                </th>
                            ))}
                            <th
                                className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                onClick={() => handleOrdenar('total')}
                            >
                                Total {obtenerIconoOrden('total')}
                            </th>
                            {mostrarEdicion && (
                                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {danzasFiltradas.map((danza, index) => {
                            const esEditando = editandoId === danza.id;
                            const medalla = obtenerMedalla(index + 1);

                            return (
                                <tr key={danza.id} className={`hover:bg-gray-50 transition-colors ${getPositionColor(index)}`}>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold">{index + 1}</span>
                                            {medalla && <span className="text-xl">{medalla}</span>}
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {esEditando ? (
                                            <input
                                                type="text"
                                                value={editandoDanza.nombre || ''}
                                                onChange={(e) => setEditandoDanza(prev => ({ ...prev, nombre: e.target.value }))}
                                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="text-sm font-medium text-gray-900">{danza.nombre}</div>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {esEditando ? (
                                            <input
                                                type="text"
                                                value={editandoDanza.gradoSeccion || ''}
                                                onChange={(e) => setEditandoDanza(prev => ({ ...prev, gradoSeccion: e.target.value }))}
                                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-600">{danza.gradoSeccion}</div>
                                        )}
                                    </td>

                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {esEditando ? (
                                            <input
                                                type="text"
                                                value={editandoDanza.grupo || ''}
                                                onChange={(e) => setEditandoDanza(prev => ({ ...prev, grupo: e.target.value }))}
                                                className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                                            />
                                        ) : (
                                            <div className="text-sm text-gray-600">{danza.grupo}</div>
                                        )}
                                    </td>

                                    {danza.puntajes.map((puntaje, i) => (
                                        <td key={i} className="px-4 py-4 whitespace-nowrap text-center">
                                            <div className="text-sm font-semibold text-gray-900">{puntaje}</div>
                                        </td>
                                    ))}

                                    <td className="px-4 py-4 whitespace-nowrap text-center">
                                        <div className="text-lg font-bold text-blue-600">
                                            {danza.total}
                                            <span className="text-sm text-gray-500 ml-1">pts</span>
                                        </div>
                                    </td>

                                    {mostrarEdicion && (
                                        <td className="px-4 py-4 whitespace-nowrap text-center">
                                            {esEditando ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={handleGuardarEdicion}
                                                        className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                        title="Guardar"
                                                    >
                                                        <Trophy className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelarEdicion}
                                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                        title="Cancelar"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center gap-2">
                                                    <button
                                                        onClick={() => handleEditar(danza)}
                                                        className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                        title="Editar"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminar(danza.id, danza.nombre)}
                                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pie de tabla */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div>
                        Total: <span className="font-semibold">{danzasFiltradas.length}</span> danzas
                    </div>
                    <div>
                        Promedio: <span className="font-semibold">
                            {(danzasFiltradas.reduce((sum, d) => sum + d.total, 0) / danzasFiltradas.length).toFixed(1)}
                        </span> puntos
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

export default TablaDanzas;
