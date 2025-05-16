import { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import { Table } from '../widgets/table';
import { Chart } from '../widgets/chart';
import { getData, type Data } from '../entities/data';
import { sortData } from '../features/sort';

export const MainPage: FC = () => {
    const [ data, setData ] = useState<Data[]>([]);

    const sortedData = useMemo(() => sortData(data),[data]);

    const fetchData = useCallback(async () => {
        try {
            const response = await getData();
            setData(response);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 1500);
        return () => clearInterval(intervalId);
    }, [fetchData]);

    return (
       <div>
            <Table data={sortedData} />
            <Chart data={data} />
       </div>
    );
};