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

export const organizationConverter = (
    isNew?: boolean
): FirestoreDataConverter<Organization, DocumentData> => {
    const newDate = new Date().toISOString();

    return {
        toFirestore: (org: Organization): DocumentData => {
            return {
                ...org,
                createdAt: isNew ? newDate : org.createdAt,
                updatedAt: newDate,
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

export const userConverter = (
    isNew?: boolean
): FirestoreDataConverter<User, DocumentData> => {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (user: User): DocumentData => {
            return {
                ...user,
                createdAt: isNew ? newDate : user.createdAt,
                updatedAt: newDate,
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

export const boardsConverter = (
    isNew?: boolean
): FirestoreDataConverter<Boards, DocumentData> => {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (boards: Boards): DocumentData => {
            return {
                ...boards,
                createdAt: isNew ? newDate : boards.createdAt,
                updatedAt: newDate,
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

export const todoConverter = (
    isNew?: boolean
): FirestoreDataConverter<Todo, DocumentData> => {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (todo: Todo): DocumentData => {
            return {
                ...todo,
                createdAt: isNew ? newDate : todo.createdAt,
                updatedAt: newDate,
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

export const boardListConverter = (
    isNew?: boolean
): FirestoreDataConverter<BoardList, DocumentData> => {
    const newDate = new Date().toISOString();
    return {
        toFirestore: (list: BoardList): DocumentData => {
            return {
                ...list,
                createdAt: isNew ? newDate : list.createdAt,
                updatedAt: newDate,
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
