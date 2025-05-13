import type { Data } from "../../../entities/data";

export const sortData = (data: Data[]): Data[] => {
    return [...data].sort((a, b) => b.value - a.value);
};