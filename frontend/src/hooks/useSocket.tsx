import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { io, Socket } from "socket.io-client";

const BACKEND_URL=import.meta.env.VITE_BACKEND_URL;

interface SocketContextVariables {
    socket: Socket | null;  // Changed from boardId
    isConnected: boolean;
}

interface SocketContextProviderProps {
  children: ReactNode;
}

const SocketContext = createContext<SocketContextVariables | undefined>(undefined);

export const SocketContextProvider = ({ children }: SocketContextProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    
    useEffect(() => {
        // Initialize connection
        const newSocket = io(BACKEND_URL);
        setSocket(newSocket);
        
        newSocket.on('connect', () => setIsConnected(true));
        newSocket.on('disconnect', () => setIsConnected(false));
        
        // Clean up the connection on unmount
        return () => {
            newSocket.disconnect();
        };
    }, [])
    
    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (context === undefined) {
        throw new Error('useSocket must be used within a SocketContextProvider');
    }
    return context;
};
