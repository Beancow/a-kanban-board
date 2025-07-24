import {
    BoardList,
    Boards,
    Todo,
    User,
    Organization,
    OrganizationMember,
} from '@/types/appState.type';
import {
    FirestoreDataConverter,
    DocumentData,
    QueryDocumentSnapshot,
} from 'firebase/firestore';

export function organizationConverter(): FirestoreDataConverter<
    Organization | FormData,
    DocumentData
> {
    const newDate = new Date().toISOString();
    return {
        toFirestore(organization: FormData): DocumentData {
            const formData = Object.fromEntries(organization.entries());
            return {
                ...formData,
                createdAt: formData.createdAt || newDate,
                updatedAt: newDate,
                data: {
                    companyName: formData.companyName || '',
                    companyWebsite: formData.companyWebsite || '',
                    logoURL: formData.logoURL || '',
                },
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): Organization => {
            const data = snapshot.data();
            const docId = snapshot.ref.id;
            return {
                id: docId,
                name: data.name,
                type: data.type,
                members: data.members || [],
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                data: {
                    companyName: data.data?.companyName || '',
                    companyWebsite: data.data?.companyWebsite || '',
                    logoURL: data.data?.logoURL || '',
                },
            };
        },
    };
}

export function userConverter(): FirestoreDataConverter<
    User | FormData,
    DocumentData
> {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (user: FormData): DocumentData => {
            const formData = Object.fromEntries(user.entries());
            return {
                ...formData,
                createdAt: formData.createdAt || newDate,
                updatedAt: newDate,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): User => {
            const data = snapshot.data();
            const docId = snapshot.ref.id;
            return {
                id: docId,
                name: data.name,
                email: data.email,
                photoURL: data.photoURL || '',
                currentBoardId: data.currentBoardId || '',
                currentOrganizationId: data.currentOrganizationId || '',
                allowedOrgs: data.allowedOrgs || [],
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
            };
        },
    };
}

export function boardsConverter(): FirestoreDataConverter<
    Boards | FormData,
    DocumentData
> {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (boards: FormData): DocumentData => {
            const formData = Object.fromEntries(boards.entries());
            return {
                ...formData,
                createdAt: formData.createdAt || newDate,
                updatedAt: newDate,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): Boards => {
            const data = snapshot.data();
            const docId = snapshot.ref.id;
            return {
                id: docId,
                title: data.title,
                tags: data.tags || [],
                ownerId: data.ownerId || '',
                organizationId: data.organizationId || '',
                description: data.description || '',
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                lists: data.lists || [],
                data: {
                    color: data.data?.color || '',
                    icon: data.data?.icon || '',
                    backgroundImage: data.data?.backgroundImage || '',
                },
                archived: data.archived || false,
                deleted: data.deleted || false,
                isPublic: data.isPublic || false,
                members: data.members || [],
            };
        },
    };
}

export function todoConverter(): FirestoreDataConverter<
    Todo | FormData,
    DocumentData
> {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (todo: FormData): DocumentData => {
            const formData = Object.fromEntries(todo.entries());
            return {
                ...formData,
                createdAt: formData.createdAt || newDate,
                updatedAt: newDate,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): Todo => {
            const data = snapshot.data();
            const docId = snapshot.ref.id;
            return {
                id: docId,
                title: data.title,
                description: data.description || '',
                completed: data.completed || false,
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                boardId: data.boardId || '',
                userId: data.userId || '',
            };
        },
    };
}

export function boardListConverter(): FirestoreDataConverter<
    BoardList | FormData,
    DocumentData
> {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (list: FormData): DocumentData => {
            const formData = Object.fromEntries(list.entries());
            return {
                ...formData,
                createdAt: formData.createdAt || newDate,
                updatedAt: newDate,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): BoardList => {
            const data = snapshot.data();
            const docId = snapshot.ref.id;
            return {
                id: docId,
                title: data.title,
                description: data.description || '',
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                boardId: data.boardId || '',
                data: data.data || {},
            };
        },
    };
}

export function organizationMemberConverter(): FirestoreDataConverter<
    OrganizationMember | FormData,
    DocumentData
> {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (member: FormData): DocumentData => {
            const formData = Object.fromEntries(member.entries());
            return {
                ...formData,
                createdAt: formData.createdAt || newDate,
                updatedAt: newDate,
            };
        },
        fromFirestore: (
            snapshot: QueryDocumentSnapshot
        ): OrganizationMember => {
            const data = snapshot.data();
            const docId = snapshot.ref.id;
            return {
                id: docId,
                name: data.name,
                photoURL: data.photoURL || '',
                updatedAt: new Date(data.updatedAt),
                createdAt: new Date(data.createdAt),
                isAdmin: data.isAdmin || false,
                isOwner: data.isOwner || false,
            };
        },
    };
}
