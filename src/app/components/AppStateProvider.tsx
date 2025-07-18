// App state should hold todos, boards and updates and then sync them to the server via a web worker when internet is available
'use client';
import { useCallback, useEffect, useState } from 'react';
import { AuthProvider } from './AuthProvider';
import React from 'react';

type Boards = {
    id: string;
    title: string;
    description?: string;
};

type Todo = {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    createdAt: Date;
    updatedAt: Date;
    boardId: string;
    userId: string;
};

type User = {
    id: string;
    name: string;
    email: string;
    photoURL?: string | Base64URLString;
    currentBoardId?: string;
    currentOrganizationId?: string;
};

type Organization = {
    id: string;
    name: string;
    members: User[];
};

type AppState = {
    user: User | null;
    boards: Boards[];
    todos: Todo[];
    organizations: Organization[];
    setUser: (user: User | null) => void;
    setBoards: (boards: Boards[]) => void;
    setTodos: (todos: Todo[]) => void;
    setOrganizations: (organizations: Organization[]) => void;
};

const AppStateContext = React.createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [boards, setBoards] = useState<Boards[]>([]);
    const [todos, setTodos] = useState<Todo[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);

    const loadFromIndexedDB = useCallback(async () => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            setUser(JSON.parse(storedUserData));
        }
        const storedBoards = localStorage.getItem('boards');
        const storedTodos = localStorage.getItem('todos');
        const storedOrganizations = localStorage.getItem('organizations');

        if (storedBoards && storedBoards !== 'undefined') setBoards(JSON.parse(storedBoards));
        if (storedTodos && storedTodos !== 'undefined') setTodos(JSON.parse(storedTodos));
        if (storedOrganizations && storedOrganizations !== 'undefined') setOrganizations(JSON.parse(storedOrganizations));
    }, []);

    useEffect(() => {
        loadFromIndexedDB();
    }, [loadFromIndexedDB]);

    const storeDataToIndexedDB = useCallback(async (keyname: string, data: any) => {
        localStorage.setItem(keyname, JSON.stringify(data));
    }, []);

    useEffect(() => {
        if (user) {
            const userData = {
                id: user.id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL,
                currentBoardId: 1752771419502,
                currentOrganizationId: user.currentOrganizationId,
            };
            storeDataToIndexedDB('userData', userData);
        }
    }, [user, storeDataToIndexedDB]);

    useEffect(() => {
        if (boards && boards.length > 0) {
            storeDataToIndexedDB('boards', boards);
        }
    }, [boards, storeDataToIndexedDB]);
    
    useEffect(() => {
        if (todos && todos.length > 0) {
            storeDataToIndexedDB('todos', todos);
        }
    }, [todos, storeDataToIndexedDB]);

    useEffect(() => {
        if (organizations && organizations.length > 0) {
            storeDataToIndexedDB('organizations', organizations);
        }
    }, [organizations, storeDataToIndexedDB]);

    const syncDataWithServer = useCallback(() => {
        console.log('Syncing data with server...');
    }, [user, boards, todos, organizations]);

    const scheduleSyncWithCancellation = useCallback(() => {
        const syncInterval = setInterval(() => {
            syncDataWithServer();
        }, 60000); // Sync every minute

        return () => clearInterval(syncInterval);
    }, [syncDataWithServer]);

    useEffect(() => {
        const cancelSync = scheduleSyncWithCancellation();
        return () => cancelSync();
    }, [scheduleSyncWithCancellation]);

    useEffect(() => {
        window.addEventListener('online', syncDataWithServer);
        return () => {
            window.removeEventListener('online', syncDataWithServer);
        };
    }, [syncDataWithServer]);

    return (
        <AppStateContext.Provider value={{ user, boards, todos, organizations, setUser, setBoards, setTodos, setOrganizations }}>
            <AuthProvider>
                {children}
            </AuthProvider>
        </AppStateContext.Provider>
    );
}

export function useAppState() {
    const context = React.useContext(AppStateContext);
    if (context === undefined) {
        throw new Error('useAppState must be used within an AppStateProvider');
    }
    return context;
}
export { AppStateContext };
export type { Boards, Todo, User, Organization, AppState };