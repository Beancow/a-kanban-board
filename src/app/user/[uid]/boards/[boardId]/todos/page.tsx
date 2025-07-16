import UserTodoList from '@/app/components/TodoList';

export default async function UserTodoPage({ params }: { params: Promise<{ uid: string, boardId: string }> }) {
    return (
        <div>
            <h1>User Todo Page</h1>
            <UserTodoList params={params} />
        </div>
    );
}
