import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Danza, Config, RankingItem } from '../types';
import { formatearTiempo } from './calculations';

export const exportToExcel = (danzas: Danza[], config: Config, filename: string = 'ranking-danzas') => {
    // Preparar datos para Excel
    const datos = danzas.map((danza, index) => {
        const fila: any = {
            'Posición': index + 1,
            'Nombre': danza.nombre,
            'Grado y Sección': danza.gradoSeccion,
            'Grupo': danza.grupo,
            'Total': danza.total,
            'Hora de Registro': formatearTiempo(danza.timestamp)
        };

        // Agregar puntajes de cada jurado
        config.jurados.forEach((jurado, i) => {
            fila[`Jurado ${jurado.nombre || i + 1}`] = danza.puntajes[i] || 0;
        });

        return fila;
    });

    // Crear workbook
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ranking General');

    // Agregar hoja de estadísticas
    const stats = generarEstadisticasExcel(danzas, config);
    const wsStats = XLSX.utils.json_to_sheet(stats);
    XLSX.utils.book_append_sheet(wb, wsStats, 'Estadísticas');

    // Descargar archivo
    XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportToCSV = (danzas: Danza[], config: Config, filename: string = 'ranking-danzas') => {
    const datos = danzas.map((danza, index) => {
        const fila: any = {
            'Posición': index + 1,
            'Nombre': danza.nombre,
            'Grado y Sección': danza.gradoSeccion,
            'Grupo': danza.grupo,
            'Total': danza.total,
            'Hora de Registro': formatearTiempo(danza.timestamp)
        };

        config.jurados.forEach((jurado, i) => {
            fila[`Jurado ${jurado.nombre || i + 1}`] = danza.puntajes[i] || 0;
        });

        return fila;
    });

    const ws = XLSX.utils.json_to_sheet(datos);
    const csv = XLSX.utils.sheet_to_csv(ws);

    // Crear y descargar archivo CSV
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToJSON = (danzas: Danza[], config: Config, filename: string = 'datos-danzas') => {
    const datos = {
        config,
        danzas,
        fechaExportacion: new Date().toISOString(),
        totalParticipantes: danzas.length
    };

    const json = JSON.stringify(datos, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToPDF = async (elementId: string, filename: string = 'ranking-danzas') => {
    const element = document.getElementById(elementId);
    if (!element) {
        throw new Error(`Elemento con ID "${elementId}" no encontrado`);
    }

    try {
        const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');

        const imgWidth = 210; // Ancho A4 en mm
        const pageHeight = 295; // Altura A4 en mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }

        pdf.save(`${filename}.pdf`);
    } catch (error) {
        console.error('Error al generar PDF:', error);
        throw error;
    }
};

export const exportRankingToPDF = async (ranking: RankingItem[], config: Config, filename: string = 'ranking-general') => {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Configuración de página
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Título
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Ranking General de Danzas', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Fecha de generación
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Generado: ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 15;

    // Encabezados de tabla
    const headers = ['Pos', 'Nombre', 'Grado', 'Grupo'];
    config.jurados.forEach((_jurado, i) => {
        headers.push(`J${i + 1}`);
    });
    headers.push('Total');

    const columnWidth = pageWidth / headers.length;
    let xPosition = 10;

    // Dibujar encabezados
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    headers.forEach((header, _index) => {
        pdf.text(header, xPosition + 2, yPosition);
        pdf.rect(xPosition, yPosition - 5, columnWidth - 2, 10);
        xPosition += columnWidth;
    });
    yPosition += 10;

    // Datos de la tabla
    pdf.setFont('helvetica', 'normal');
    ranking.forEach((item, _index) => {
        if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
        }

        xPosition = 10;
        const rowData = [
            item.posicion.toString(),
            item.danza.nombre,
            item.danza.gradoSeccion,
            item.danza.grupo,
            ...item.danza.puntajes.map(p => p.toString()),
            item.danza.total.toString()
        ];

        rowData.forEach((data, colIndex) => {
            pdf.text(data, xPosition + 2, yPosition);
            if (colIndex < headers.length - 1) {
                pdf.rect(xPosition, yPosition - 5, columnWidth - 2, 10);
            }
            xPosition += columnWidth;
        });
        yPosition += 10;
    });

    // Pie de página
    const totalPages = pdf.internal.pages.length - 1; // Restar 1 porque la primera página es el contenido estático
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.text(`Página ${i} de ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    pdf.save(`${filename}.pdf`);
};

const generarEstadisticasExcel = (danzas: Danza[], config: Config) => {
    if (danzas.length === 0) {
        return [{ 'Estadística': 'Sin datos', 'Valor': '-' }];
    }

    const totales = danzas.map(d => d.total);
    const promedioGeneral = totales.reduce((sum, total) => sum + total, 0) / danzas.length;
    const puntajeMasAlto = Math.max(...totales);
    const puntajeMasBajo = Math.min(...totales);

    const estadisticas = [
        { 'Estadística': 'Total de Participantes', 'Valor': danzas.length },
        { 'Estadística': 'Puntaje Más Alto', 'Valor': puntajeMasAlto },
        { 'Estadística': 'Puntaje Más Bajo', 'Valor': puntajeMasBajo },
        { 'Estadística': 'Promedio General', 'Valor': promedioGeneral.toFixed(2) },
        { 'Estadística': 'Cantidad de Jurados', 'Valor': config.cantidadJurados },
        { 'Estadística': 'Escala de Puntaje', 'Valor': `${config.escalaPuntaje.min} - ${config.escalaPuntaje.max}` }
    ];

    // Agregar promedio por jurado
    config.jurados.forEach((jurado, i) => {
        const promedioJurado = danzas.reduce((sum, danza) => sum + (danza.puntajes[i] || 0), 0) / danzas.length;
        estadisticas.push({
            'Estadística': `Promedio Jurado ${jurado.nombre || i + 1}`,
            'Valor': promedioJurado.toFixed(2)
        });
    });

    // Distribución por grupos
    const distribucion: Record<string, number> = {};
    danzas.forEach(danza => {
        distribucion[danza.grupo] = (distribucion[danza.grupo] || 0) + 1;
    });

    estadisticas.push({ 'Estadística': '', 'Valor': '' }); // Separador
    Object.entries(distribucion).forEach(([grupo, cantidad]) => {
        estadisticas.push({
            'Estadística': `Participantes ${grupo}`,
            'Valor': cantidad
        });
    });

    return estadisticas;
};

export const importFromJSON = (file: File): Promise<{ config: Config; danzas: Danza[] }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const data = JSON.parse(content);

                // Validar estructura básica
                if (!data.config || !data.danzas) {
                    throw new Error('El archivo no tiene el formato válido');
                }

                resolve({
                    config: data.config,
                    danzas: data.danzas
                });
            } catch (error) {
                reject(new Error('Error al leer el archivo JSON: ' + error));
            }
        };

        reader.onerror = () => {
            reject(new Error('Error al leer el archivo'));
        };

        reader.readAsText(file);
    });
};
