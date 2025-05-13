import { useEffect, useState, type FC } from 'react';
import { getData } from '../../../entities/data';
import type { Data } from '../../../entities/data';
import { sortData } from '../../../features/sort';
import { motion, AnimatePresence } from 'framer-motion';

export const Table: FC = () => {
    const [ data, setData ] = useState<Data[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getData();
                const sortedData = sortData(response);
                setData(sortedData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 1500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="p-4">
            <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                                Value
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        <AnimatePresence>
                            {data.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {item.value}
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
