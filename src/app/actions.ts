"use server";
import { firebaseGetFirestore } from "firebase-config";
import { doc, setDoc, addDoc, getDoc, getDocs, collection } from "firebase/firestore"; 

const createTodo = async (data: FormData) => {

    const db = firebaseGetFirestore();

    const todo = {
        id: data.get('title')?.toString().replace(/\s+/g, '-').toLowerCase() || Date.now().toString(),
        title: data.get('title')?.valueOf(),
        description: data.get('description')?.valueOf(),
        completed: false,
    };

    if (!todo.title || !todo.description) {
        throw new Error('Invalid data');
    }

    setDoc(doc(db, 'users/1/todos', todo.id), todo);
    const response = await addDoc(collection(db, 'users/1/todos'), { ...todo  });

    return {
        success: true,
        data: response,
    };
}
const getTodos = async () => {

    const db = firebaseGetFirestore();
    const todosCollection = collection(db, 'users/1/todos');
    const todosSnapshot = await getDocs(todosCollection);
    const todosList = todosSnapshot.docs.map(doc => doc.data());

    return {
        success: true,
        data: todosList,
    };
}

const getTodo = async (todoId: string) => {

    const db = firebaseGetFirestore();

    const todoDoc = doc(db, 'users/1/todos', todoId);
    const todoSnapshot = await getDoc(todoDoc);

    if (!todoSnapshot.exists()) {
        throw new Error('Todo not found');
    }

    return {
        success: true,
        data: todoSnapshot.data(),  
    };
}

export { createTodo, getTodos, getTodo };
