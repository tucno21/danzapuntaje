export interface Jurado {
    id: string;
    nombre?: string;
}

export interface Danza {
    id: string;
    nombre: string;
    gradoSeccion: string;
    grupo: string;
    puntajes: number[]; // array con puntaje de cada jurado
    total: number;
    timestamp: number;
}

export interface Config {
    cantidadJurados: number;
    jurados: Jurado[];
    escalaPuntaje: { min: number; max: number };
    gradosSecciones: GradoSeccion[];
    grupos: Grupo[];
}

export interface GradoSeccion {
    id: string;
    nombre: string; // ej: "1° A", "2° B"
}

export interface Grupo {
    id: string;
    nombre: string; // ej: "Grupo 1", "Grupo 2"
}

export interface RankingItem {
    danza: Danza;
    posicion: number;
}

export interface Estadisticas {
    totalParticipantes: number;
    puntajeMasAlto: number;
    puntajeMasBajo: number;
    promedioGeneral: number;
    promedioPorJurado: number[];
    distribucionPorGrupos: Record<string, number>;
}

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
}
