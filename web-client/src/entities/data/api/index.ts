import { WS } from "../../../shared/api";
import type { Data } from "../model";

export async function getData(): Promise<Data[]> {
    const wsUrl = 'ws://localhost:8080/test';
    const requestType = 'getTestData';

    const ws = new WS(wsUrl);
  
    let connectionError: Error | null = null;
  
    return new Promise<Data[]>((resolve, reject) => {
        ws.onError((event) => {
            connectionError = new Error(`WebSocket error: ${event.type}`);
            console.error('WebSocket error:', event);
            reject(connectionError);
        });
        
        ws.onClose(() => {
            console.log('WebSocket closed');
            if (!connectionError) {
                reject(new Error('WebSocket connection closed before response'));
            }
        });
        
        ws.onMessage((event) => {
            console.log('Received message:', event.data);
        });
        
        ws.onOpen(() => {
            console.log('WebSocket connected, sending request...');
            ws.sendRequest<Data[]>(requestType, undefined, 15000)
                .then(response => {
                    console.log('Received response:', response);
                    if (Array.isArray(response)) {
                        resolve(response);
                    } else {
                        reject(new Error('Invalid response format'));
                    }
            })       
        });
        
        ws.connect();
    });
}