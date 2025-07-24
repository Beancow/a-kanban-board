'use server';
import {
    firebaseGetFirestore,
    firebaseAuth,
} from '@/lib/firebase/firebase-config';
import { Organization, OrganizationMember } from '@/types/appState.type';
import {
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    collection,
} from 'firebase/firestore';
import { organizationConverter } from './firebaseServerActionConverters';

const auth = firebaseAuth;

export async function getUserAction(uid: string) {
    const db = firebaseGetFirestore();
    const userDoc = doc(db, `users/${uid}`);
    const response = await getDoc(userDoc);

    if (!response.exists()) {
        throw new Error('User not found');
    }

    return {
        success: true,
        data: response.data(),
    };
}

export async function checkAuthenticationAction(): Promise<{
    success: boolean;
    data: {
        uid: string;
        email: string | null;
        displayName: string | null;
    } | null;
    error?: Error;
}> {
    const user = auth.currentUser;
    if (!user) {
        return {
            success: false,
            data: null,
            error: new Error('User is not authenticated'),
        };
    }

    return {
        success: true,
        data: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
        },
    };
}

export async function getOrgMembersAction(
    orgId: string
): Promise<OrganizationMember[]> {
    const db = firebaseGetFirestore();
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
    const db = firebaseGetFirestore();

    if (!orgId) {
        throw new Error('Organization ID is required');
    }

    const orgDoc = doc(db, `organizations/${orgId}`);
    const response = await getDoc(orgDoc);

    if (!response.exists()) {
        return {
            success: false,
            data: null,
            error: new Error('Organization not found'),
        };
    }

    return {
        success: true,
        data: response.data(),
    };
}

export async function addMemberToOrganizationAction(data: FormData) {
    const db = firebaseGetFirestore();

    const newMember: OrganizationMember = {
        id: data.get('uid')?.toString() || '',
        name: data.get('name')?.toString() || '',
        photoURL: data.get('photoURL')?.toString() || '',
        updatedAt: new Date(),
        createdAt: new Date(),
        isAdmin: false,
        isOwner: false,
    };

    const orgId = data.get('orgId')?.toString();

    if (!newMember.id || !orgId) {
        return {
            success: false,
            data: null,
            error: new Error('Organization ID and Member ID are required'),
        };
    }

    const orgDoc = doc(db, `organizations/${orgId}`);
    const orgSnapshot = await getDoc(orgDoc);

    if (!orgSnapshot.exists()) {
        return {
            success: false,
            data: null,
            error: new Error('Organization not found'),
        };
    }

    const orgData = orgSnapshot.data();
    const members: OrganizationMember[] = orgData.members || [];

    if (members.every((member) => member.id !== newMember.id)) {
        return {
            success: false,
            data: null,
            error: new Error('Member already exists in the organization'),
        };
    }

    members.push(newMember);

    await updateDoc(orgDoc, { members });
    return {
        success: true,
        data: { orgId, members },
    };
}

export async function createOrganizationAction(data: FormData) {
    const db = firebaseGetFirestore();

    const orgType = data.get('type')?.toString();

    const validOrgTypes = ['personal', 'company'];

    const isValidOrgType = (
        orgType: string
    ): orgType is Organization['type'] => {
        if (!orgType) return true;
        if (validOrgTypes.includes(orgType)) return true;
        return false;
    };

    if (!orgType || !isValidOrgType(orgType)) {
        return {
            success: false,
            data: null,
            error: new Error('Invalid organization type'),
        };
    }

    const organization: Organization = {
        id: data.get('orgId')?.toString() || undefined,
        name: data.get('name')?.toString() || '',
        type: isValidOrgType(orgType) ? orgType : 'personal',
        members: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        data: {
            companyName: data.get('companyName')?.toString() || '',
            companyWebsite: data.get('companyWebsite')?.toString() || '',
            logoURL: data.get('logoURL')?.toString() || '',
        },
    };

    if (!organization.name || !organization.data?.companyName) {
        return {
            success: false,
            data: null,
            error: new Error('Invalid organization data'),
        };
    }

    const response = await addDoc(collection(db, 'organizations'), {
        ...organization,
    });

    return {
        success: true,
        data: response,
    };
}

export async function getOrganizationListAction() {
    const db = firebaseGetFirestore();
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
            doc.data().withConverter(organizationConverter)
        );
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

export async function createTodoAction(
    data: FormData,
    uid: string,
    boardId: string
) {
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
}

export async function createBoardAction(data: FormData, uid: string) {
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

    if (!response) {
        return {
            success: false,
            data: null,
            error: new Error('Failed to create board'),
        };
    }

    return {
        success: true,
        data: response,
    };
}

export async function getTodosAction(uid: string, boardId: string) {
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
                error: 'No todos found',
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
            error: Error(
                error instanceof Error ? error.message : 'Unknown error',
                {
                    cause: error,
                }
            ),
        };
    }
}

export async function getBoardsAction(username: string) {
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
            error: 'No boards found',
        };
    }

    return {
        success: true,
        data: boardsList,
    };
}

export async function getTodoAction(
    uid: string,
    boardId: string,
    todoId: string
) {
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
            return {
                success: false,
                data: null,
                error: 'Todo not found',
            };
        }
        return {
            success: true,
            data: response.data(),
            error: null,
        };
    } catch (error) {
        return {
            success: false,
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}
