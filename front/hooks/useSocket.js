import { useEffect, useCallback, useRef } from 'react';

export default function useSocket(url, onMessage, onFail) {
    const socket = useRef();
    const msgHandler = useRef();
    msgHandler.current = onMessage;

    useEffect(() => {
        const createdWebSocket = new WebSocket(url);
        createdWebSocket.onmessage = (event) => {
            msgHandler.current(JSON.parse(event.data));
        }

        socket.current = createdWebSocket;

        return () => {
            createdWebSocket.close();
        }
    }, [url]);

    return useCallback(
        (data) => {
            try {
                socket.current.send(JSON.stringify(data))
            } catch(e) {
                console.error(e);
                onFail && onFail();
            }
            
        }, []
    );
}