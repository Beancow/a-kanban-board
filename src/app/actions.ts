"use server";
import { firebaseGetFirestore } from "firebase-config";
import { doc, addDoc, getDoc, getDocs, collection } from "firebase/firestore"; 

const createTodo = async (data: FormData, uid: string, boardId: string) => {
    const db = firebaseGetFirestore();

    const todo = {
        title: data.get('title')?.valueOf(),
        description: data.get('description')?.valueOf(),
        completed: false,
    };

    if (!todo.title || !todo.description) {
        throw new Error('Invalid data');
    }

    const response = await addDoc(collection(db, `users/${uid}/boards/${boardId}/todos`), { ...todo  });

    return {
        success: true,
        data: response,
    };
}

export async function createBoard(data: FormData, uid: string) {
    const db = firebaseGetFirestore();

    const board = {
        title: data.get('title')?.valueOf(),
        description: data.get('description')?.valueOf(),
    };

    if (!board.title || !board.description) {
        throw new Error('Invalid data');
    }

    const response = await addDoc(collection(db, `users/${uid}/boards`), { ...board });

    return {
        success: true,
        data: response,
    };
}

export async function getTodos(uid: string, boardId: string) {
    const db = firebaseGetFirestore();
    const todosCollection = collection(db, `users/${uid}/boards/${boardId}/todos`);
    try {
        const todosSnapshot = await getDocs(todosCollection);

        const todosList = todosSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));
        if (!todosList || todosList.length === 0) {
            return {
                success: false,
                data: [],
            };
        }
    
        return {
            success: true,
            data: todosList,        
        };
    } catch (error) {
        console.error('Error fetching todos:', error);
        return {
            success: false,
            data: [],
        };
    }
}

export async function getBoards(username: string) {
    const db = firebaseGetFirestore();
    const boardsCollection = collection(db, `users/${username}/boards`);
    const boardsSnapshot = await getDocs(boardsCollection);
    const boardsList = boardsSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

    if (!boardsList || boardsList.length === 0) {
        return {
            success: false,
            data: [],
        };
    }

    return {
        success: true,
        data: boardsList,
    };
}

export async function getTodo(uid: string, boardId: string, todoId: string) {
    const db = firebaseGetFirestore();
    try {
        if (!todoId) {
            throw new Error('Todo ID is required');
        }
    const todoDoc = doc(db, `users/${uid}/boards/${boardId}/todos/${todoId}`);
    const response = await getDoc(todoDoc);

    if (!response.exists()) {
        throw new Error('Todo not found');
    }
    return {
        success: true,
        data: response.data(),
        error: null,
    };
    } catch (error) {
        console.error('Error fetching todo:', error);
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

export { createTodo };
