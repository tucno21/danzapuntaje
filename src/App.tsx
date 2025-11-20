import React, { useState } from 'react';
import { Trophy, Users, Menu, X } from 'lucide-react';
import { useDanzasStore } from './store/danzasStore';
import { getGruposUnicos, obtenerEstadisticas } from './utils/calculations';

// Component imports
import ConfigJurados from './components/ConfigJurados';
import UltimaDanza from './components/UltimaDanza';
import FormularioDanza from './components/FormularioDanza';
import TablaDanzas from './components/TablaDanzas';
import ExportButtons from './components/ExportButtons';
import ToastContainer from './components/ToastContainer';

const App: React.FC = () => {
  const { danzas, getRankingGeneral, getRankingPorGrupos } = useDanzasStore();

  const [activeTab, setActiveTab] = useState<'general' | 'grupos'>('general');
  const [selectedGrupo, setSelectedGrupo] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const rankingGeneral = getRankingGeneral();
  const rankingPorGrupos = getRankingPorGrupos();
  const grupos = getGruposUnicos(danzas);
  const estadisticas = obtenerEstadisticas(danzas);

  const handleGrupoChange = (grupo: string) => {
    setSelectedGrupo(grupo);
    setActiveTab('grupos');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'grupos':
        if (!selectedGrupo && grupos.length > 0) {
          return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {grupos.map((grupo: string) => {
                const rankingGrupo = rankingPorGrupos[grupo] || [];
                const cantidad = rankingGrupo.length;

                return (
                  <button
                    key={grupo}
                    onClick={() => handleGrupoChange(grupo)}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-200 hover:scale-105 text-left"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        {cantidad}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{grupo}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      Ver ranking del grupo
                    </p>
                  </button>
                );
              })}
            </div>
          );
        }

        if (selectedGrupo) {
          const rankingGrupo = rankingPorGrupos[selectedGrupo] || [];
          return (
            <div className="space-y-4">
              <button
                onClick={() => setSelectedGrupo('')}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver a grupos
              </button>
              <TablaDanzas
                titulo={`Ranking - ${selectedGrupo}`}
                danzas={rankingGrupo.map(item => item.danza)}
                grupoFiltrado={selectedGrupo}
              />
            </div>
          );
        }

        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No hay grupos registrados
            </h3>
            <p className="text-gray-500">
              Registra algunas danzas para ver los rankings por grupos
            </p>
          </div>
        );

      case 'general':
      default:
        return <TablaDanzas titulo="Ranking General" danzas={rankingGeneral.map(item => item.danza)} mostrarEdicion />;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Calificación</h1>
                <p className="text-sm text-gray-600">Competencias de Danza</p>
              </div>
            </div>

            {/* Navegación desktop */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setActiveTab('general')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'general'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Trophy className="w-4 h-4" />
                Ranking General
              </button>

              <button
                onClick={() => setActiveTab('grupos')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'grupos'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Users className="w-4 h-4" />
                Por Grupos
              </button>
            </nav>

            {/* Configuración y menú móvil */}
            <div className="flex items-center gap-3">
              <ConfigJurados />

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Navegación móvil */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setActiveTab('general');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'general'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Trophy className="w-4 h-4" />
                  Ranking General
                </button>

                <button
                  onClick={() => {
                    setActiveTab('grupos');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'grupos'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                >
                  <Users className="w-4 h-4" />
                  Por Grupos
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Sección de última danza registrada */}
          <UltimaDanza />

          {/* Formulario de registro */}
          <FormularioDanza />

          {/* Tabs de rankings */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Rankings</h2>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'general'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  General
                </button>
                <button
                  onClick={() => setActiveTab('grupos')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'grupos'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  Por Grupos
                </button>
              </div>
            </div>

            {/* Estadísticas generales */}
            {danzas.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{danzas.length}</div>
                  <div className="text-sm text-gray-700">Total Danzas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{estadisticas.puntajeMasAlto}</div>
                  <div className="text-sm text-gray-700">Puntaje Más Alto</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{estadisticas.puntajeMasBajo}</div>
                  <div className="text-sm text-gray-700">Puntaje Más Bajo</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{estadisticas.promedioGeneral}</div>
                  <div className="text-sm text-gray-700">Promedio</div>
                </div>
              </div>
            )}

            {/* Contenido del tab activo */}
            <div className="min-h-[400px]">
              {renderTabContent()}
            </div>
          </div>

          {/* Sección de exportación */}
          <ExportButtons />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              Sistema de Calificación para Competencias de Danza
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Desarrollado con React, TypeScript y Tailwind CSS
            </p>
          </div>
        </div>
      </footer>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default App;
