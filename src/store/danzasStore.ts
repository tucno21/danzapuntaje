import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Danza, Config, RankingItem, Estadisticas, ToastMessage } from '../types';

interface DanzasState {
    // Estado
    config: Config;
    danzas: Danza[];
    ultimaDanza: Danza | null;
    toasts: ToastMessage[];

    // Acciones de configuración
    setConfig: (config: Config) => void;
    updateCantidadJurados: (cantidad: number) => void;
    updateNombreJurado: (id: string, nombre: string) => void;
    updateEscalaPuntaje: (min: number, max: number) => void;

    // CRUD Grados y Secciones
    addGradoSeccion: (nombre: string) => void;
    updateGradoSeccion: (id: string, nombre: string) => void;
    deleteGradoSeccion: (id: string) => void;

    // CRUD Grupos
    addGrupo: (nombre: string) => void;
    updateGrupo: (id: string, nombre: string) => void;
    deleteGrupo: (id: string) => void;

    // Acciones de danzas
    addDanza: (danza: Omit<Danza, 'id' | 'total' | 'timestamp'>) => void;
    updateDanza: (id: string, updates: Partial<Danza>) => void;
    deleteDanza: (id: string) => void;
    clearAllDanzas: () => void;

    // Acciones de UI
    addToast: (toast: Omit<ToastMessage, 'id'>) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // Acciones derivadas
    getRankingGeneral: () => RankingItem[];
    getRankingPorGrupo: (grupo: string) => RankingItem[];
    getRankingPorGrupos: () => Record<string, RankingItem[]>;
    getEstadisticas: () => Estadisticas;
    getGrupos: () => string[];
    getUltimaDanza: () => Danza | null;
}

const initialConfig: Config = {
    cantidadJurados: 3,
    jurados: [
        { id: '1', nombre: 'Jurado 1' },
        { id: '2', nombre: 'Jurado 2' },
        { id: '3', nombre: 'Jurado 3' }
    ],
    escalaPuntaje: { min: 0, max: 100 },
    gradosSecciones: [
        { id: '1', nombre: '1° A' },
        { id: '2', nombre: '1° B' },
        { id: '3', nombre: '2° A' },
        { id: '4', nombre: '2° B' },
        { id: '5', nombre: '3° A' },
        { id: '6', nombre: '3° B' }
    ],
    grupos: [
        { id: '1', nombre: 'Grupo 1' },
        { id: '2', nombre: 'Grupo 2' },
        { id: '3', nombre: 'Grupo 3' }
    ]
};

export const useDanzasStore = create<DanzasState>()(
    persist(
        (set, get) => ({
            // Estado inicial
            config: initialConfig,
            danzas: [],
            ultimaDanza: null,
            toasts: [],

            // Acciones de configuración
            setConfig: (config) => {
                set({ config });
                get().addToast({
                    type: 'success',
                    message: 'Configuración actualizada correctamente'
                });
            },

            updateCantidadJurados: (cantidad) => {
                const state = get();
                const nuevosJurados = Array.from({ length: cantidad }, (_, i) => ({
                    id: (i + 1).toString(),
                    nombre: state.config.jurados[i]?.nombre || `Jurado ${i + 1}`
                }));

                const newConfig = {
                    ...state.config,
                    cantidadJurados: cantidad,
                    jurados: nuevosJurados
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'success',
                    message: `Cantidad de jurados actualizada a ${cantidad}`
                });
            },

            updateNombreJurado: (id, nombre) => {
                const state = get();
                const nuevosJurados = state.config.jurados.map(jurado =>
                    jurado.id === id ? { ...jurado, nombre } : jurado
                );

                const newConfig = {
                    ...state.config,
                    jurados: nuevosJurados
                };

                set({ config: newConfig });
            },

            updateEscalaPuntaje: (min, max) => {
                const state = get();
                const newConfig = {
                    ...state.config,
                    escalaPuntaje: { min, max }
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'success',
                    message: `Escala de puntaje actualizada: ${min} - ${max}`
                });
            },

            // CRUD Grados y Secciones
            addGradoSeccion: (nombre) => {
                const state = get();
                const nuevoGradoSeccion = {
                    id: Date.now().toString(),
                    nombre
                };

                const newConfig = {
                    ...state.config,
                    gradosSecciones: [...state.config.gradosSecciones, nuevoGradoSeccion]
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'success',
                    message: `Grado/Sección "${nombre}" agregado correctamente`
                });
            },

            updateGradoSeccion: (id, nombre) => {
                const state = get();
                const nuevosGradosSecciones = state.config.gradosSecciones.map(gs =>
                    gs.id === id ? { ...gs, nombre } : gs
                );

                const newConfig = {
                    ...state.config,
                    gradosSecciones: nuevosGradosSecciones
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'success',
                    message: 'Grado/Sección actualizado correctamente'
                });
            },

            deleteGradoSeccion: (id) => {
                const state = get();
                const gradoSeccion = state.config.gradosSecciones.find(gs => gs.id === id);

                if (!gradoSeccion) {
                    get().addToast({
                        type: 'error',
                        message: 'Grado/Sección no encontrado'
                    });
                    return;
                }

                const nuevosGradosSecciones = state.config.gradosSecciones.filter(gs => gs.id !== id);
                const newConfig = {
                    ...state.config,
                    gradosSecciones: nuevosGradosSecciones
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'warning',
                    message: `Grado/Sección "${gradoSeccion.nombre}" eliminado`
                });
            },

            // CRUD Grupos
            addGrupo: (nombre) => {
                const state = get();
                const nuevoGrupo = {
                    id: Date.now().toString(),
                    nombre
                };

                const newConfig = {
                    ...state.config,
                    grupos: [...state.config.grupos, nuevoGrupo]
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'success',
                    message: `Grupo "${nombre}" agregado correctamente`
                });
            },

            updateGrupo: (id, nombre) => {
                const state = get();
                const nuevosGrupos = state.config.grupos.map(grupo =>
                    grupo.id === id ? { ...grupo, nombre } : grupo
                );

                const newConfig = {
                    ...state.config,
                    grupos: nuevosGrupos
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'success',
                    message: 'Grupo actualizado correctamente'
                });
            },

            deleteGrupo: (id) => {
                const state = get();
                const grupo = state.config.grupos.find(g => g.id === id);

                if (!grupo) {
                    get().addToast({
                        type: 'error',
                        message: 'Grupo no encontrado'
                    });
                    return;
                }

                const nuevosGrupos = state.config.grupos.filter(g => g.id !== id);
                const newConfig = {
                    ...state.config,
                    grupos: nuevosGrupos
                };

                set({ config: newConfig });
                get().addToast({
                    type: 'warning',
                    message: `Grupo "${grupo.nombre}" eliminado`
                });
            },

            // Acciones de danzas
            addDanza: (danzaData) => {
                const state = get();
                const id = Date.now().toString();
                const timestamp = Date.now();

                // Validar que los puntajes coincidan con la cantidad de jurados
                if (danzaData.puntajes.length !== state.config.cantidadJurados) {
                    get().addToast({
                        type: 'error',
                        message: 'La cantidad de puntajes no coincide con la cantidad de jurados'
                    });
                    return;
                }

                // Validar rango de puntajes
                const puntajesValidos = danzaData.puntajes.every(
                    puntaje => puntaje >= state.config.escalaPuntaje.min &&
                        puntaje <= state.config.escalaPuntaje.max
                );

                if (!puntajesValidos) {
                    get().addToast({
                        type: 'error',
                        message: `Los puntajes deben estar entre ${state.config.escalaPuntaje.min} y ${state.config.escalaPuntaje.max}`
                    });
                    return;
                }

                const total = danzaData.puntajes.reduce((sum, puntaje) => sum + puntaje, 0);

                const nuevaDanza: Danza = {
                    ...danzaData,
                    id,
                    total,
                    timestamp
                };

                set((prevState) => ({
                    danzas: [...prevState.danzas, nuevaDanza],
                    ultimaDanza: nuevaDanza
                }));

                get().addToast({
                    type: 'success',
                    message: `Danza "${danzaData.nombre}" registrada exitosamente`
                });
            },

            updateDanza: (id, updates) => {
                const state = get();
                const index = state.danzas.findIndex(d => d.id === id);

                if (index === -1) {
                    get().addToast({
                        type: 'error',
                        message: 'Danza no encontrada'
                    });
                    return;
                }

                const danzaActualizada = { ...state.danzas[index], ...updates };

                // Si se actualizaron los puntajes, recalcular el total
                if (updates.puntajes) {
                    danzaActualizada.total = updates.puntajes.reduce((sum, puntaje) => sum + puntaje, 0);
                }

                set((prevState) => ({
                    danzas: prevState.danzas.map((d, i) => i === index ? danzaActualizada : d),
                    ultimaDanza: prevState.ultimaDanza?.id === id ? danzaActualizada : prevState.ultimaDanza
                }));

                get().addToast({
                    type: 'success',
                    message: 'Danza actualizada correctamente'
                });
            },

            deleteDanza: (id) => {
                const state = get();
                const danza = state.danzas.find(d => d.id === id);

                if (!danza) {
                    get().addToast({
                        type: 'error',
                        message: 'Danza no encontrada'
                    });
                    return;
                }

                set((prevState) => ({
                    danzas: prevState.danzas.filter(d => d.id !== id),
                    ultimaDanza: prevState.ultimaDanza?.id === id ? null : prevState.ultimaDanza
                }));

                get().addToast({
                    type: 'warning',
                    message: `Danza "${danza.nombre}" eliminada`
                });
            },

            clearAllDanzas: () => {
                set({
                    danzas: [],
                    ultimaDanza: null
                });

                get().addToast({
                    type: 'warning',
                    message: 'Todas las danzas han sido eliminadas'
                });
            },

            // Acciones de UI
            addToast: (toast) => {
                const id = Date.now().toString();
                const newToast: ToastMessage = { ...toast, id };

                set((prevState) => ({
                    toasts: [...prevState.toasts, newToast]
                }));

                // Auto remover después del tiempo especificado
                const duration = toast.duration || 3000;
                setTimeout(() => {
                    get().removeToast(id);
                }, duration);
            },

            removeToast: (id) => {
                set((prevState) => ({
                    toasts: prevState.toasts.filter(t => t.id !== id)
                }));
            },

            clearToasts: () => {
                set({ toasts: [] });
            },

            // Acciones derivadas
            getRankingGeneral: () => {
                const state = get();
                return [...state.danzas]
                    .sort((a, b) => b.total - a.total)
                    .map((danza, index) => ({
                        danza,
                        posicion: index + 1
                    }));
            },

            getRankingPorGrupo: (grupo) => {
                const state = get();
                return state.danzas
                    .filter(danza => danza.grupo === grupo)
                    .sort((a, b) => b.total - a.total)
                    .map((danza, index) => ({
                        danza,
                        posicion: index + 1
                    }));
            },

            getRankingPorGrupos: () => {
                const state = get();
                const grupos = new Set(state.danzas.map(danza => danza.grupo));
                const rankingsPorGrupos: Record<string, RankingItem[]> = {};

                grupos.forEach(grupo => {
                    rankingsPorGrupos[grupo] = state.danzas
                        .filter(danza => danza.grupo === grupo)
                        .sort((a, b) => b.total - a.total)
                        .map((danza, index) => ({
                            danza,
                            posicion: index + 1
                        }));
                });

                return rankingsPorGrupos;
            },

            getEstadisticas: (): Estadisticas => {
                const state = get();
                const { danzas, config } = state;

                if (danzas.length === 0) {
                    return {
                        totalParticipantes: 0,
                        puntajeMasAlto: 0,
                        puntajeMasBajo: 0,
                        promedioGeneral: 0,
                        promedioPorJurado: Array(config.cantidadJurados).fill(0),
                        distribucionPorGrupos: {}
                    };
                }

                const totales = danzas.map(d => d.total);
                const puntajeMasAlto = Math.max(...totales);
                const puntajeMasBajo = Math.min(...totales);
                const promedioGeneral = totales.reduce((sum, total) => sum + total, 0) / danzas.length;

                // Promedio por jurado
                const promedioPorJurado = Array.from({ length: config.cantidadJurados }, (_, i) => {
                    const sumaPuntajes = danzas.reduce((sum, danza) => sum + (danza.puntajes[i] || 0), 0);
                    return danzas.length > 0 ? sumaPuntajes / danzas.length : 0;
                });

                // Distribución por grupos
                const distribucionPorGrupos = danzas.reduce((acc, danza) => {
                    acc[danza.grupo] = (acc[danza.grupo] || 0) + 1;
                    return acc;
                }, {} as Record<string, number>);

                return {
                    totalParticipantes: danzas.length,
                    puntajeMasAlto,
                    puntajeMasBajo,
                    promedioGeneral,
                    promedioPorJurado,
                    distribucionPorGrupos
                };
            },

            getGrupos: () => {
                const state = get();
                const grupos = new Set(state.danzas.map(danza => danza.grupo));
                return Array.from(grupos).sort();
            },

            getUltimaDanza: () => {
                return get().ultimaDanza;
            }
        }),
        {
            name: 'danzas-storage',
            partialize: (state) => ({
                config: state.config,
                danzas: state.danzas,
                ultimaDanza: state.ultimaDanza
            })
        }
    )
);
