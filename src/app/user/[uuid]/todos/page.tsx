    import UserTodoList from '@/app/components/UserTodoList';

export default async function UserTodoPage({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;

    return (
        <div>
            <h1>User Todo Page</h1>
            <UserTodoList uuid={uuid} />
        </div>
    );
}
