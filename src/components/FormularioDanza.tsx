import React, { useState, useEffect } from 'react';
import { Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useDanzasStore } from '../store/danzasStore';
import { validarPuntajes } from '../utils/calculations';

const FormularioDanza: React.FC = () => {
    const { config, addDanza, danzas } = useDanzasStore();

    const [formData, setFormData] = useState({
        nombre: '',
        gradoSeccion: '',
        grupo: '',
        puntajes: Array(config.cantidadJurados).fill('')
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Resetear form cuando cambia la cantidad de jurados
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            puntajes: Array(config.cantidadJurados).fill('')
        }));
        setErrors({});
    }, [config.cantidadJurados]);

    // Calcular total automáticamente
    const totalActual = formData.puntajes.reduce((sum, puntaje) => {
        const num = parseFloat(puntaje);
        return isNaN(num) ? sum : sum + num;
    }, 0);

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        // Validar nombre
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre de la danza es requerido';
        }

        // Validar grado y sección
        if (!formData.gradoSeccion.trim()) {
            newErrors.gradoSeccion = 'El grado y sección son requeridos';
        }

        // Validar grupo
        if (!formData.grupo.trim()) {
            newErrors.grupo = 'El grupo es requerido';
        }

        // Validar puntajes
        const puntajesNumericos = formData.puntajes.map(p => parseFloat(p)).filter(p => !isNaN(p));

        if (puntajesNumericos.length !== config.cantidadJurados) {
            newErrors.puntajes = 'Todos los puntajes son requeridos';
        } else {
            const puntajesValidos = validarPuntajes(puntajesNumericos, config);
            if (!puntajesValidos) {
                newErrors.puntajes = `Los puntajes deben estar entre ${config.escalaPuntaje.min} y ${config.escalaPuntaje.max}`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const puntajesNumericos = formData.puntajes.map(p => parseFloat(p));

            addDanza({
                nombre: formData.nombre.trim(),
                gradoSeccion: formData.gradoSeccion.trim(),
                grupo: formData.grupo.trim(),
                puntajes: puntajesNumericos
            });

            // Resetear formulario
            setFormData({
                nombre: '',
                gradoSeccion: '',
                grupo: '',
                puntajes: Array(config.cantidadJurados).fill('')
            });
            setErrors({});

        } catch (error) {
            console.error('Error al registrar danza:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePuntajeChange = (index: number, value: string) => {
        const newPuntajes = [...formData.puntajes];
        newPuntajes[index] = value;
        setFormData(prev => ({ ...prev, puntajes: newPuntajes }));

        // Limpiar error de puntajes si existe
        if (errors.puntajes) {
            setErrors(prev => ({ ...prev, puntajes: '' }));
        }
    };

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpiar error si existe
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    // Obtener grados ya utilizados
    const gradosUtilizados = new Set(danzas.map(danza => danza.gradoSeccion));

    // Opciones dinámicas para grados (solo los que no han sido utilizados)
    const gradosDisponibles = config.gradosSecciones
        .filter(gs => !gradosUtilizados.has(gs.nombre))
        .map(gs => gs.nombre);

    // Opciones predefinidas para grupos
    const gruposOptions = config.grupos.map(g => g.nombre);

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-100 rounded-lg">
                    <Plus className="w-5 h-5 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Registrar Nueva Danza</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Fila principal: Nombre, Grado, Grupo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Nombre de la danza */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre de la Danza <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => handleInputChange('nombre', e.target.value)}
                            placeholder="Ej: Danza Contemporánea"
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            disabled={isSubmitting}
                        />
                        {errors.nombre && (
                            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.nombre}
                            </div>
                        )}
                    </div>

                    {/* Grado y Sección */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grado y Sección <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.gradoSeccion}
                            onChange={(e) => handleInputChange('gradoSeccion', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg ${errors.gradoSeccion ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            disabled={isSubmitting}
                        >
                            <option value="">Seleccionar grado y sección</option>
                            {gradosDisponibles.map(grado => (
                                <option key={grado} value={grado}>
                                    {grado}
                                </option>
                            ))}
                        </select>
                        {errors.gradoSeccion && (
                            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.gradoSeccion}
                            </div>
                        )}
                        {gradosDisponibles.length === 0 && (
                            <div className="flex items-center gap-1 mt-1 text-orange-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                Todos los grados ya han sido utilizados
                            </div>
                        )}
                    </div>

                    {/* Grupo */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Grupo <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.grupo}
                            onChange={(e) => handleInputChange('grupo', e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg ${errors.grupo ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            disabled={isSubmitting}
                        >
                            <option value="">Seleccionar grupo</option>
                            {gruposOptions.map(grupo => (
                                <option key={grupo} value={grupo}>
                                    {grupo}
                                </option>
                            ))}
                        </select>
                        {errors.grupo && (
                            <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.grupo}
                            </div>
                        )}
                    </div>
                </div>

                {/* Puntajes de jurados */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Puntajes por Jurado <span className="text-red-500">*</span>
                        <span className="text-gray-500 font-normal ml-2">
                            (Rango: {config.escalaPuntaje.min} - {config.escalaPuntaje.max})
                        </span>
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {formData.puntajes.map((puntaje, index) => (
                            <div key={index} className="relative">
                                <label className="block text-xs text-gray-600 mb-1">
                                    {config.jurados[index]?.nombre || `Jurado ${index + 1}`}
                                </label>
                                <input
                                    type="number"
                                    value={puntaje}
                                    onChange={(e) => handlePuntajeChange(index, e.target.value)}
                                    placeholder="0"
                                    min={config.escalaPuntaje.min}
                                    max={config.escalaPuntaje.max}
                                    step="0.1"
                                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg text-center font-bold ${errors.puntajes ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        } ${puntaje && !isNaN(parseFloat(puntaje)) ? 'bg-green-50' : ''}`}
                                    disabled={isSubmitting}
                                />
                                {puntaje && !isNaN(parseFloat(puntaje)) && (
                                    <div className="absolute -top-1 -right-1">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {errors.puntajes && (
                        <div className="flex items-center gap-1 mt-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {errors.puntajes}
                        </div>
                    )}
                </div>

                {/* Total calculado */}
                <div className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="text-sm font-medium text-gray-700">Total Calculado</label>
                            <p className="text-xs text-gray-500">Suma automática de puntajes</p>
                        </div>
                        <div className="text-right">
                            <div className="text-3xl font-bold text-blue-600">
                                {totalActual.toFixed(1)}
                            </div>
                            <div className="text-sm text-gray-600">puntos</div>
                        </div>
                    </div>
                </div>

                {/* Botón de envío */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Registrando...
                        </>
                    ) : (
                        <>
                            <Plus className="w-5 h-5" />
                            Registrar Danza
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default FormularioDanza;
