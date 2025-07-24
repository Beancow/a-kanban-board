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
                id: org.id,
                name: org.name,
                type: org.type,
                members: org.members || [],
                createdAt: org.createdAt,
                updatedAt: org.updatedAt,
                data: {
                    companyName: org.data?.companyName || '',
                    companyWebsite: org.data?.companyWebsite || '',
                    logoURL: org.data?.logoURL || '',
                },
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
                id: user.id,
                name: user.name,
                email: user.email,
                photoURL: user.photoURL || '',
                currentBoardId: user.currentBoardId || '',
                currentOrganizationId: user.currentOrganizationId || '',
                allowedOrgs: user.allowedOrgs || [],
                createdAt: user.createdAt || new Date(),
                updatedAt: user.updatedAt || new Date(),
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
                id: boards.id,
                title: boards.title,
                description: boards.description || '',
                createdAt: boards.createdAt,
                updatedAt: boards.updatedAt,
                lists: boards.lists || [],
                data: boards.data || {},
                archived: boards.archived || false,
                deleted: boards.deleted || false,
                isPublic: boards.isPublic || false,
                ownerId: boards.ownerId || '',
                organizationId: boards.organizationId || '',
                tags: boards.tags || [],
                members: boards.members || [],
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
                id: todo.id,
                title: todo.title,
                description: todo.description || '',
                completed: todo.completed,
                createdAt: todo.createdAt,
                updatedAt: todo.updatedAt,
                boardId: todo.boardId,
                userId: todo.userId,
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
                id: list.id,
                title: list.title,
                description: list.description || '',
                createdAt: list.createdAt,
                updatedAt: list.updatedAt,
                boardId: list.boardId,
                data: list.data || {},
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
                id: member.id,
                name: member.name,
                photoURL: member.photoURL || '',
                updatedAt: member.updatedAt,
                createdAt: member.createdAt,
                isAdmin: member.isAdmin || false,
                isOwner: member.isOwner || false,
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
