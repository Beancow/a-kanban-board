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

export const organizationConverter = (): FirestoreDataConverter<
    Organization,
    DocumentData
> => {
    return {
        toFirestore: (org: Organization): DocumentData => {
            return {
                ...org,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): Organization => {
            const data = snapshot.data();
            return {
                id: data.id,
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
};

export const userConverter = (): FirestoreDataConverter<User, DocumentData> => {
    return {
        toFirestore: (user: User): DocumentData => {
            return {
                ...user,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): User => {
            const data = snapshot.data();
            return {
                id: data.id,
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
};

export const boardsConverter = (): FirestoreDataConverter<
    Boards,
    DocumentData
> => {
    return {
        toFirestore: (boards: Boards): DocumentData => {
            return {
                ...boards,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): Boards => {
            const data = snapshot.data();
            return {
                id: data.id,
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
};

export const todoConverter = (): FirestoreDataConverter<Todo, DocumentData> => {
    return {
        toFirestore: (todo: Todo): DocumentData => {
            return {
                ...todo,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): Todo => {
            const data = snapshot.data();
            return {
                id: data.id,
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
};

export const boardListConverter = (): FirestoreDataConverter<
    BoardList,
    DocumentData
> => {
    return {
        toFirestore: (list: BoardList): DocumentData => {
            return {
                ...list,
            };
        },
        fromFirestore: (snapshot: QueryDocumentSnapshot): BoardList => {
            const data = snapshot.data();
            return {
                id: data.id,
                title: data.title,
                description: data.description || '',
                createdAt: new Date(data.createdAt),
                updatedAt: new Date(data.updatedAt),
                boardId: data.boardId || '',
                data: data.data || {},
            };
        },
    };
};

export const organizationMemberConverter = (): FirestoreDataConverter<
    OrganizationMember,
    DocumentData
> => {
    return {
        toFirestore: (member: OrganizationMember): DocumentData => {
            return {
                ...member,
            };
        },
        fromFirestore: (
            snapshot: QueryDocumentSnapshot
        ): OrganizationMember => {
            const data = snapshot.data();
            return {
                id: data.id,
                name: data.name,
                photoURL: data.photoURL || '',
                updatedAt: new Date(data.updatedAt),
                createdAt: new Date(data.createdAt),
                isAdmin: data.isAdmin || false,
                isOwner: data.isOwner || false,
            };
        },
    };
};
