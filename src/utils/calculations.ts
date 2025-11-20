import type { Danza, Config } from '../types';

export const calcularTotal = (puntajes: number[]): number => {
    return puntajes.reduce((sum, puntaje) => sum + puntaje, 0);
};

export const validarPuntajes = (puntajes: number[], config: Config): boolean => {
    return puntajes.every(
        puntaje => puntaje >= config.escalaPuntaje.min &&
            puntaje <= config.escalaPuntaje.max
    );
};

export const formatearPuntaje = (puntaje: number, decimales: number = 1): string => {
    return puntaje.toFixed(decimales);
};

export const obtenerMedalla = (posicion: number): string => {
    switch (posicion) {
        case 1:
            return '🥇';
        case 2:
            return '🥈';
        case 3:
            return '🥉';
        default:
            return '';
    }
};

export const obtenerColorPosicion = (posicion: number): string => {
    switch (posicion) {
        case 1:
            return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        case 2:
            return 'text-gray-600 bg-gray-50 border-gray-200';
        case 3:
            return 'text-orange-600 bg-orange-50 border-orange-200';
        default:
            return 'text-gray-700 bg-white border-gray-200';
    }
};

export const formatearTiempo = (timestamp: number): string => {
    const fecha = new Date(timestamp);
    return fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
};

// Obtener grupos únicos de las danzas
export const getGruposUnicos = (danzas: Danza[]): string[] => {
    const grupos = new Set(danzas.map(danza => danza.grupo));
    return Array.from(grupos).sort();
};

// Calcular estadísticas generales
export const obtenerEstadisticas = (danzas: Danza[]) => {
    if (danzas.length === 0) {
        return {
            puntajeMasAlto: 0,
            puntajeMasBajo: 0,
            promedioGeneral: 0,
            totalParticipantes: 0
        };
    }

    const totales = danzas.map(d => d.total);
    const puntajeMasAlto = Math.max(...totales);
    const puntajeMasBajo = Math.min(...totales);
    const promedioGeneral = totales.reduce((sum, total) => sum + total, 0) / danzas.length;

    return {
        puntajeMasAlto,
        puntajeMasBajo,
        promedioGeneral: promedioGeneral.toFixed(1),
        totalParticipantes: danzas.length
    };
};

export const generarPromedios = (danzas: Danza[]): number[] => {
    if (danzas.length === 0) return [];

    const cantidadJurados = danzas[0].puntajes.length;
    const promedios: number[] = [];

    for (let i = 0; i < cantidadJurados; i++) {
        const suma = danzas.reduce((total, danza) => total + danza.puntajes[i], 0);
        promedios.push(suma / danzas.length);
    }

    return promedios;
};

export const calcularEstadisticasAvanzadas = (danzas: Danza[]) => {
    if (danzas.length === 0) {
        return {
            desviacionEstandar: 0,
            mediana: 0,
            moda: 0,
            rango: 0
        };
    }

    const totales = danzas.map(d => d.total);
    const sorted = [...totales].sort((a, b) => a - b);

    // Mediana
    const mediana = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];

    // Moda
    const frecuencia: Record<number, number> = {};
    totales.forEach(total => {
        frecuencia[total] = (frecuencia[total] || 0) + 1;
    });

    const moda = Number(Object.keys(frecuencia).reduce((a, b) =>
        frecuencia[Number(a)] > frecuencia[Number(b)] ? a : b
    ));

    // Desviación estándar
    const promedio = totales.reduce((sum, total) => sum + total, 0) / totales.length;
    const varianza = totales.reduce((sum, total) => sum + Math.pow(total - promedio, 2), 0) / totales.length;
    const desviacionEstandar = Math.sqrt(varianza);

    // Rango
    const rango = Math.max(...totales) - Math.min(...totales);

    return {
        desviacionEstandar,
        mediana,
        moda,
        rango
    };
};
