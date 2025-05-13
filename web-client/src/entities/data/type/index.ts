import type { Data } from "../model";

export interface DataResponse {
    type: string;
    payload: Data[];
};