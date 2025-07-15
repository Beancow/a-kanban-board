import { getTodo } from "@/app/actions"; 
export default async function TodoDetails({ params }: { params: Promise<{ todoId: string, uuid: string }> }) {
    const { todoId, uuid } = await params;

    if (!todoId) {
        return <div>Loading...</div>;
    }

    const todo = await getTodo(todoId, uuid);

    if (!todo || !todo.data) {
        return <div>Todo not found.</div>;
    }

    return (
        <div>
            <h1>Todo Details</h1>
            <p>Viewing details for todo: {todo.data.title}</p>
            <h2>{todo.data.title}</h2>
            <p>{todo.data.description}</p>
            <p>Completed: {todo.data.completed ? 'Yes' : 'No'}</p>
            </div>
        );

}