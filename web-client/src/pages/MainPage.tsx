import type { FC } from 'react';
import { Table } from '../widgets/table';
import { Chart } from '../widgets/chart';

export const MainPage: FC = () => {
    return (
       <div>
            <Table />
            <Chart />
       </div>
    );
};