import type { FC } from 'react';
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { chartScheme } from '../../../features/chart';
import type { IChartProps } from '../type/props';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
 
export const Chart: FC<IChartProps> = ({data}) => {
    const labels = data.map((item) => item.name);
    const values = data.map((item) => item.value);
    const colors = '#38BB3D';

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Значение',
                data: values,
                backgroundColor: colors,
                borderRadius: 8,
                barThickness: 60
            }
        ]
    };

    return (
        <section className="m-4 p-4 rounded-[24px] bg-[#F4F5F8]">
            <div className="w-full h-[300px]">
                <Bar data={chartData} options={chartScheme} />
            </div>
        </section>
    );
};
