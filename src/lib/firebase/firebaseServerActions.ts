'use server';
import { firebaseGetFirestore } from '@/lib/firebase/firebase-config';
import {
    Boards,
    Organization,
    OrganizationMember,
    Todo,
    User,
} from '@/types/appState.type';
import { doc, addDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import {
    boardsConverter,
    organizationConverter,
    organizationMemberConverter,
    todoConverter,
    userConverter,
} from './firebaseServerActionConverters';
import { todo } from 'node:test';

const db = firebaseGetFirestore();

export async function getUserAction(uid: string) {
    const userDoc = doc(db, `users/${uid}`);
    const response = await getDoc(userDoc);

    if (!response.exists()) {
        return {
            success: false,
            data: null,
            error: new Error('User not found'),
        };
    }

    const userData: User = response.data().withConverter(userConverter);

    if (!userData) {
        return {
            success: false,
            data: null,
            error: new Error('User data is empty'),
        };
    }

    return {
        success: true,
        data: userData,
    };
}

export async function getOrgMembersAction(
    orgId: string
): Promise<OrganizationMember[]> {
    const orgDoc = doc(db, `organizations/${orgId}`);
    return getDoc(orgDoc).then((response) => {
        if (!response.exists()) {
            return {
                success: false,
                data: [],
                error: new Error('Organization not found'),
            };
        }
        return response.data().members || [];
    });
}

export async function getOrganizationAction(orgId: string) {
    const orgDoc = doc(db, `organizations/${orgId}`);
    try {
        const response = await getDoc(orgDoc);
        const organization: Organization = response
            .data()
            ?.withConverter(organizationConverter());
        return {
            success: true,
            data: organization,
        };
    } catch (error) {
        console.error('Error fetching organization:', error);
        return {
            success: false,
            error: new Error('Failed to fetch organization', { cause: error }),
        };
    }
}

export async function addMemberToOrganizationAction(data: FormData) {
    const orgId = data.get('orgId')?.valueOf();
    const orgMembers = collection(db, `organizations/${orgId}-members`);

    try {
        const response = await addDoc(orgMembers, data);
        return {
            success: true,
            data: response.withConverter(organizationMemberConverter()),
        };
    } catch (error) {
        console.error('Error adding member to organization:', error);
        return {
            success: false,
            error: new Error('Failed to add member to organization', {
                cause: error,
            }),
        };
    }
}

export async function createOrganizationAction(data: FormData) {
    const organizations = collection(db, 'organizations').withConverter(
        organizationConverter()
    );
    try {
        const response = await addDoc(organizations, data);
        return {
            success: response.type === 'document',
            data: response,
        };
    } catch (error) {
        console.error('Error creating organization:', error);
        return {
            success: false,
            error: new Error('Failed to create organization', { cause: error }),
        };
    }
}

export async function getOrganizationListAction() {
    const orgsCollection = collection(db, 'organizations');

    const orgsSnapshot = await getDocs(orgsCollection);

    if (orgsSnapshot.empty) {
        return {
            success: false,
            data: [],
        };
    }

    try {
        const orgsList: Organization[] = orgsSnapshot.docs.map((doc) =>
            doc.data().withConverter(organizationConverter())
        );
        return {
            success: true,
            data: orgsList,
        };
    } catch (error) {
        console.error('Error fetching organizations:', error);
        return {
            success: false,
            error: new Error('Failed to fetch organizations', { cause: error }),
        };
    }
}

export async function createTodoAction(
    data: FormData,
    uid: string,
    boardId: string
) {
    const todosCollection = collection(
        db,
        `users/${uid}/boards/${boardId}/todos`
    ).withConverter(userConverter());

    const response = await addDoc(todosCollection, data);

    if (!response) {
        return {
            success: false,
            data: null,
            error: new Error('Failed to create todo'),
        };
    }

    return {
        success: true,
        data: response,
    };
}

export async function createBoardAction(data: FormData, uid: string) {
    const boardCollection = collection(db, `users/${uid}/boards`).withConverter(
        boardsConverter()
    );
    try {
        const response = await addDoc(boardCollection, data);

        const newBoard = response.id;

        return {
            success: true,
            data: { ...response, id: newBoard },
        };
    } catch (error) {
        console.error('Error creating board:', error);
        return {
            success: false,
            error: new Error('Failed to create board', { cause: error }),
        };
    }
}

export async function getTodosAction(uid: string, boardId: string) {
    const todosCollection = collection(
        db,
        `users/${uid}/boards/${boardId}/todos`
    );

    try {
        const todosSnapshot = await getDocs(todosCollection);

        const todosList: Todo[] = todosSnapshot.docs.map((doc) =>
            doc.data().withConverter(todoConverter())
        );
        return {
            success: true,
            data: todosList,
        };
    } catch (error) {
        console.error('Error fetching todos:', error);
        return {
            success: false,
            error: new Error('Failed to fetch todos'),
        };
    }
}

export async function getBoardsAction(username: string) {
    const boardsCollection = collection(db, `users/${username}/boards`);

    try {
        const boardsSnapshot = await getDocs(boardsCollection);

        const boardsList: Boards[] = boardsSnapshot.docs.map((doc) =>
            doc.data().withConverter(boardsConverter())
        );

        return {
            success: true,
            data: boardsList,
        };
    } catch (error) {
        console.error('Error fetching boards:', error);
        return {
            success: false,
            error: new Error('Failed to fetch boards', { cause: error }),
        };
    }
}

export async function getTodoAction(
    uid: string,
    boardId: string,
    todoId: string
) {
    const todoDoc = doc(db, `users/${uid}/boards/${boardId}/todos/${todoId}`);

    try {
        const response = await getDoc(todoDoc);
        const todo: Todo = response.data()?.withConverter(todoConverter());
        return {
            success: true,
            data: todo,
        };
    } catch (error) {
        console.error('Error fetching todo:', error);
        return {
            success: false,
            error: new Error('Failed to fetch todo', { cause: error }),
        };
    }
}
