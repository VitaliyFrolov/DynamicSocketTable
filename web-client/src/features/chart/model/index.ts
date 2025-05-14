import type { ChartOptions } from 'chart.js';

export const chartScheme: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }
    },
    scales: {
        x: {
            type: 'category',
            ticks: {
                font: { size: 14, weight: 500 },
                color: '#2B2A29'
            }
        },
        y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {
                stepSize: 10,
                color: '#2B2A29',
                font: { size: 12 }
            },
            suggestedMin: 0,
            suggestedMax: 10
        }
    }
};
