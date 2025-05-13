type Callback = () => void;
type MessageCallback = (event: MessageEvent) => void;
type ErrorCallback = (event: Event) => void;

interface WSEvents {
    onOpen?: Callback;
    onMessage?: MessageCallback;
    onError?: ErrorCallback;
    onClose?: Callback;
}

type WSMessage = {
    type: string;
    requestId?: string;
    payload?: unknown;
};

type PendingResolver = (data: WSMessage) => void;

export class WS {
    private socket: WebSocket | null = null;
    private readonly url: string;
    private isConnected = false;
    private callbacks: WSEvents = {};
    private pendingRequests = new Map<string, PendingResolver>();

    constructor(url: string) {
        this.url = url;
    }

    connect(): void {
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            this.isConnected = true;
            this.callbacks.onOpen?.();
        };

        this.socket.onmessage = (event: MessageEvent) => {
            try {
                const message: WSMessage = JSON.parse(event.data);

                if (message.requestId && this.pendingRequests.has(message.requestId)) {
                    const resolve = this.pendingRequests.get(message.requestId)!;
                    this.pendingRequests.delete(message.requestId);
                    resolve(message);
                } else {
                    this.callbacks.onMessage?.(event);
                }
            } catch {
                console.warn("Invalid message received:", event.data);
            }
        };
            this.socket.onerror = (event: Event) => {
            this.callbacks.onError?.(event);
        };

            this.socket.onclose = () => {
            this.isConnected = false;
            this.callbacks.onClose?.();
        };
    }

    send(data: string | ArrayBufferLike | Blob | ArrayBufferView): void {
        if (this.socket && this.isConnected) {
            this.socket.send(data);
        } else {
            console.error("WebSocket is not connected.");
        }
    }

    sendJson(data: WSMessage): void {
        this.send(JSON.stringify(data));
    }

    sendRequest<T = unknown>(
        type: string,
        payload: unknown,
        timeout = 5000
    ): Promise<T> {
        const requestId = this.generateId();

        const message: WSMessage = {
            type,
            requestId,
            payload,
        };

        return new Promise<T>((resolve, reject) => {
            const timer = setTimeout(() => {
                this.pendingRequests.delete(requestId);
                reject(new Error("WebSocket request timeout"));
            }, timeout);

            this.pendingRequests.set(requestId, (response) => {
                clearTimeout(timer);
                resolve(response.payload as T);
            });

            this.sendJson(message);
        });
    }

    close(): void {
        if (this.socket && this.isConnected) {
            this.socket.close();
        }
    }

    onOpen(callback: Callback): void {
        this.callbacks.onOpen = callback;
    }

    onMessage(callback: MessageCallback): void {
        this.callbacks.onMessage = callback;
    }

    onError(callback: ErrorCallback): void {
        this.callbacks.onError = callback;
    }

    onClose(callback: Callback): void {
        this.callbacks.onClose = callback;
    }

    isConnectedNow(): boolean {
        return this.isConnected;
    }

    private generateId(): string {
        return Math.random().toString(36).substring(2, 10);
    }
}
