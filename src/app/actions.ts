'use server';
import { firebaseGetFirestore } from '@/firebase-config';
import {
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
} from 'firebase/firestore';

export async function getOrgMembers(orgId: string) {
    const db = firebaseGetFirestore();
    const orgDoc = doc(db, `organizations/${orgId}`);
    return getDoc(orgDoc).then((response) => {
        if (!response.exists()) {
            throw new Error('Organization not found');
        }
        return response.data().members || [];
    });
}

export async function getOrganization(orgId: string) {
    const db = firebaseGetFirestore();

    if (!orgId) {
        throw new Error('Organization ID is required');
    }

    const orgDoc = doc(db, `organizations/${orgId}`);
    const response = await getDoc(orgDoc);

    if (!response.exists()) {
        throw new Error('Organization not found');
    }

    return {
        success: true,
        data: response.data(),
    };
}

export async function addMemberToOrganization(data: FormData) {
    const db = firebaseGetFirestore();

    const orgId = data.get('orgId')?.valueOf();
    const memberId = data.get('memberId')?.valueOf();
    if (!orgId || !memberId) {
        throw new Error('Organization ID and Member ID are required');
    }

    const orgDoc = doc(db, `organizations/${orgId}`);
    const orgSnapshot = await getDoc(orgDoc);

    if (!orgSnapshot.exists()) {
        throw new Error('Organization not found');
    }

    const orgData = orgSnapshot.data();
    const members = orgData.members || [];

    if (members.includes(memberId)) {
        throw new Error('Member already exists in the organization');
    }

    members.push(memberId);

    await updateDoc(orgDoc, { members });
    return {
        success: true,
        data: { orgId, memberId },
    };
}

export async function createOrganization(data: FormData) {
    const db = firebaseGetFirestore();

    const organization = {
        name: data.get('name')?.valueOf(),
        description: data.get('description')?.valueOf(),
        members: [],
    };
    if (!organization.name || !organization.description) {
        throw new Error('Invalid organization data');
    }

    const response = await addDoc(collection(db, 'organizations'), {
        ...organization,
    });

    return {
        success: true,
        data: response,
    };
}

export async function getOrganizationList({ orgId }: { orgId?: string }) {
    const db = firebaseGetFirestore();
    const orgsCollection = collection(db, 'organizations');
    const orgsSnapshot = await getDocs(orgsCollection);

    console.log('OrgId:', orgId);

    if (orgsSnapshot.empty) {
        return {
            success: false,
            data: [],
        };
    }
    try {
        const orgsList = orgsSnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
            current: orgId?.toString() === doc.id,
        }));
        return {
            success: true,
            data: orgsList,
        };
    } catch (error) {
        console.error('Error fetching organizations:', error);
        return {
            success: false,
            data: [],
        };
    }
}

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

    const response = await addDoc(
        collection(db, `users/${uid}/boards/${boardId}/todos`),
        { ...todo }
    );

    return {
        success: true,
        data: response,
    };
};

export async function createBoard(data: FormData, uid: string) {
    const db = firebaseGetFirestore();

    const board = {
        title: data.get('title')?.valueOf(),
        description: data.get('description')?.valueOf(),
    };

    if (!board.title || !board.description) {
        throw new Error('Invalid data');
    }

    const response = await addDoc(collection(db, `users/${uid}/boards`), {
        ...board,
    });

    return {
        success: true,
        data: response,
    };
}

export async function getTodos(uid: string, boardId: string) {
    const db = firebaseGetFirestore();
    const todosCollection = collection(
        db,
        `users/${uid}/boards/${boardId}/todos`
    );
    try {
        const todosSnapshot = await getDocs(todosCollection);

        const todosList = todosSnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));
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
    const boardsList = boardsSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }));

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
        const todoDoc = doc(
            db,
            `users/${uid}/boards/${boardId}/todos/${todoId}`
        );
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
