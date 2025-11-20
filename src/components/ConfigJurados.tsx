import React, { useState } from 'react';
import { Settings, Plus, Edit2, Trash2, X, Save, User, Sliders, List, Users } from 'lucide-react';
import { useDanzasStore } from '../store/danzasStore';
import ConfirmDialog from './ConfirmDialog';

const ConfigJurados: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'jurados' | 'escala' | 'grados' | 'grupos'>('jurados');

    // Estados para edición
    const [editingGrado, setEditingGrado] = useState<string | null>(null);
    const [editingGrupo, setEditingGrupo] = useState<string | null>(null);
    const [newGradoName, setNewGradoName] = useState('');
    const [newGrupoName, setNewGrupoName] = useState('');
    const [escalaMin, setEscalaMin] = useState(0);
    const [escalaMax, setEscalaMax] = useState(100);

    // Estados para confirmación
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

    const {
        config,
        updateNombreJurado,
        updateEscalaPuntaje,
        updateCantidadJurados,
        addGradoSeccion,
        updateGradoSeccion,
        deleteGradoSeccion,
        addGrupo,
        updateGrupo,
        deleteGrupo
    } = useDanzasStore();

    const handleSaveEscala = () => {
        if (escalaMin >= escalaMax) {
            alert('El valor mínimo debe ser menor que el valor máximo');
            return;
        }
        updateEscalaPuntaje(escalaMin, escalaMax);
    };

    const handleAddGrado = () => {
        if (newGradoName.trim()) {
            addGradoSeccion(newGradoName.trim());
            setNewGradoName('');
        }
    };

    const handleUpdateGrado = (id: string) => {
        if (editingGrado && editingGrado !== id) return;

        const input = document.getElementById(`grado-${id}`) as HTMLInputElement;
        if (input && input.value.trim()) {
            updateGradoSeccion(id, input.value.trim());
            setEditingGrado(null);
        }
    };

    const handleDeleteGrado = (id: string, nombre: string) => {
        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'Eliminar Grado/Sección',
            message: `¿Está seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            onConfirm: () => deleteGradoSeccion(id)
        });
    };

    const handleAddGrupo = () => {
        if (newGrupoName.trim()) {
            addGrupo(newGrupoName.trim());
            setNewGrupoName('');
        }
    };

    const handleUpdateGrupo = (id: string) => {
        if (editingGrupo && editingGrupo !== id) return;

        const input = document.getElementById(`grupo-${id}`) as HTMLInputElement;
        if (input && input.value.trim()) {
            updateGrupo(id, input.value.trim());
            setEditingGrupo(null);
        }
    };

    const handleDeleteGrupo = (id: string, nombre: string) => {
        setConfirmDialog({
            isOpen: true,
            type: 'danger',
            title: 'Eliminar Grupo',
            message: `¿Está seguro de eliminar "${nombre}"? Esta acción no se puede deshacer.`,
            onConfirm: () => deleteGrupo(id)
        });
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
                <Settings className="w-4 h-4 text-gray-600" />
                <span className="font-medium text-gray-700">Configuración</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        {/* Header */}
                        <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Settings className="w-6 h-6" />
                                    <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setActiveTab('jurados')}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'jurados'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                Jurados
                            </button>
                            <button
                                onClick={() => setActiveTab('escala')}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'escala'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <Sliders className="w-4 h-4" />
                                Escala de Puntaje
                            </button>
                            <button
                                onClick={() => setActiveTab('grados')}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'grados'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                Grados y Secciones
                            </button>
                            <button
                                onClick={() => setActiveTab('grupos')}
                                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${activeTab === 'grupos'
                                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                <Users className="w-4 h-4" />
                                Grupos
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            {/* Tab Jurados */}
                            {activeTab === 'jurados' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">Cantidad de Jurados</h3>
                                        <select
                                            value={config.cantidadJurados}
                                            onChange={(e) => updateCantidadJurados(Number(e.target.value))}
                                            className="px-4 py-2 border border-gray-300 rounded-lg"
                                        >
                                            {[2, 3, 4, 5].map(num => (
                                                <option key={num} value={num}>{num} Jurados</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <h4 className="text-md font-medium text-gray-700 mb-4">Nombres de los Jurados</h4>
                                        <div className="space-y-3">
                                            {config.jurados.map((jurado) => (
                                                <div key={jurado.id} className="flex items-center gap-3">
                                                    <span className="text-sm text-gray-500 w-20">Jurado {jurado.id}:</span>
                                                    <input
                                                        type="text"
                                                        value={jurado.nombre || ''}
                                                        onChange={(e) => updateNombreJurado(jurado.id, e.target.value)}
                                                        placeholder="Nombre del jurado"
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Tab Escala */}
                            {activeTab === 'escala' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Configurar Escala de Puntaje</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Puntaje Mínimo</label>
                                            <input
                                                type="number"
                                                value={config.escalaPuntaje.min}
                                                onChange={(e) => setEscalaMin(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Puntaje Máximo</label>
                                            <input
                                                type="number"
                                                value={config.escalaPuntaje.max}
                                                onChange={(e) => setEscalaMax(Number(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <p className="text-sm text-blue-800">
                                            <strong>Escala actual:</strong> {config.escalaPuntaje.min} - {config.escalaPuntaje.max}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleSaveEscala}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        Guardar Escala
                                    </button>
                                </div>
                            )}

                            {/* Tab Grados */}
                            {activeTab === 'grados' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Grados y Secciones</h3>

                                    {/* Agregar nuevo */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newGradoName}
                                            onChange={(e) => setNewGradoName(e.target.value)}
                                            placeholder="Ej: 4° A"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddGrado()}
                                        />
                                        <button
                                            onClick={handleAddGrado}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Lista de grados */}
                                    <div className="space-y-2">
                                        {config.gradosSecciones.map((grado) => (
                                            <div key={grado.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                {editingGrado === grado.id ? (
                                                    <input
                                                        id={`grado-${grado.id}`}
                                                        type="text"
                                                        defaultValue={grado.nombre}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdateGrado(grado.id);
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="flex-1 font-medium">{grado.nombre}</span>
                                                )}
                                                <div className="flex gap-1">
                                                    {editingGrado === grado.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateGrado(grado.id)}
                                                                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingGrado(null)}
                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => setEditingGrado(grado.id)}
                                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteGrado(grado.id, grado.nombre)}
                                                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tab Grupos */}
                            {activeTab === 'grupos' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-gray-900">Grupos</h3>

                                    {/* Agregar nuevo */}
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newGrupoName}
                                            onChange={(e) => setNewGrupoName(e.target.value)}
                                            placeholder="Ej: Grupo 4"
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                                            onKeyPress={(e) => e.key === 'Enter' && handleAddGrupo()}
                                        />
                                        <button
                                            onClick={handleAddGrupo}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Lista de grupos */}
                                    <div className="space-y-2">
                                        {config.grupos.map((grupo) => (
                                            <div key={grupo.id} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                                {editingGrupo === grupo.id ? (
                                                    <input
                                                        id={`grupo-${grupo.id}`}
                                                        type="text"
                                                        defaultValue={grupo.nombre}
                                                        className="flex-1 px-2 py-1 border border-gray-300 rounded"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUpdateGrupo(grupo.id);
                                                            }
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span className="flex-1 font-medium">{grupo.nombre}</span>
                                                )}
                                                <div className="flex gap-1">
                                                    {editingGrupo === grupo.id ? (
                                                        <>
                                                            <button
                                                                onClick={() => handleUpdateGrupo(grupo.id)}
                                                                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                                            >
                                                                <Save className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingGrupo(null)}
                                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                            >
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => setEditingGrupo(grupo.id)}
                                                                className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteGrupo(grupo.id, grupo.nombre)}
                                                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Dialog */}
            <ConfirmDialog
                isOpen={confirmDialog.isOpen}
                onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmDialog.onConfirm}
                title={confirmDialog.title}
                message={confirmDialog.message}
                type={confirmDialog.type}
            />
        </>
    );
};

export default ConfigJurados;
