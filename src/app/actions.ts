"use server";
import { firebaseGetFirestore } from "firebase-config";
import { doc, addDoc, getDoc, getDocs, collection } from "firebase/firestore"; 

const createTodo = async (data: FormData, uuid: string) => {
    const db = firebaseGetFirestore();

    const todo = {
        title: data.get('title')?.valueOf(),
        description: data.get('description')?.valueOf(),
        completed: false,
    };

    if (!todo.title || !todo.description) {
        throw new Error('Invalid data');
    }

    const response = await addDoc(collection(db, `users/${uuid}/todos`), { ...todo  });

    return {
        success: true,
        data: response,
    };
}

export async function getTodos(username: string) {
    const db = firebaseGetFirestore();
    const todosCollection = collection(db, `users/${username}/todos`);
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
    const boardsList = boardsSnapshot.docs.map(doc => doc.data());

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

export async function getTodo(todoId: string, uuid: string) {
    const db = firebaseGetFirestore();
    try {
        if (!todoId) {
            throw new Error('Todo ID is required');
        }
    const todoDoc = doc(db, `users/${uuid}/todos`, todoId);
    const todoSnapshot = await getDoc(todoDoc);

    if (!todoSnapshot.exists()) {
        throw new Error('Todo not found');
    }
    return {
        success: true,
        data: todoSnapshot.data(),  
    };
    } catch (error) {
        console.error('Error fetching todo:', error);
        return {
            success: false,
            data: null,
        };
    }
}

export { createTodo };
