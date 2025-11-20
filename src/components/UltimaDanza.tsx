import React, { useEffect } from 'react';
import { Star } from 'lucide-react';
import { useDanzasStore } from '../store/danzasStore';
import { obtenerMedalla } from '../utils/calculations';

const UltimaDanza: React.FC = () => {
    const { getUltimaDanza, getRankingGeneral } = useDanzasStore();
    const ultimaDanza = getUltimaDanza();
    const ranking = getRankingGeneral();

    // Encontrar la posición de la última danza en el ranking
    const posicionUltimaDanza = ultimaDanza
        ? ranking.find(item => item.danza.id === ultimaDanza.id)?.posicion
        : null;

    useEffect(() => {
        // Animación de entrada cuando hay una nueva danza
        if (ultimaDanza) {
            const element = document.getElementById('ultima-danza-card');
            if (element) {
                element.classList.add('animate-pulse');
                setTimeout(() => {
                    element.classList.remove('animate-pulse');
                }, 2000);
            }
        }
    }, [ultimaDanza?.id]);

    if (!ultimaDanza) {
        return (
            <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-5 text-center border border-gray-200">
                <div className="flex flex-col items-center gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Sin Danzas Registradas
                        </h3>
                        <p className="text-gray-500">
                            Comienza registrando la primera presentación para verla aquí
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const medalla = posicionUltimaDanza ? obtenerMedalla(posicionUltimaDanza) : null;

    return (
        <div
            id="ultima-danza-card"
            className="bg-linear-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200 shadow-lg"
        >
            {/* Información en una sola fila */}
            <div className="flex items-center justify-between">
                {/* Icono y título */}
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Star className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Última Danza Registrada</h2>
                    </div>
                </div>

                {/* Información principal distribuida */}
                <div className="flex items-center gap-8">
                    <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nombre</div>
                        <div className="font-bold text-gray-900">{ultimaDanza.nombre}</div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Grado</div>
                        <div className="font-bold text-gray-900">{ultimaDanza.gradoSeccion}</div>
                    </div>

                    <div className="text-center">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Puntaje</div>
                        <div className="text-2xl font-bold text-blue-600">
                            {ultimaDanza.total}
                            <span className="text-sm font-normal text-gray-600 ml-1">pts</span>
                        </div>
                    </div>

                    {medalla && (
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{medalla}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UltimaDanza;
