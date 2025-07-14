import { getTodo } from "@/app/actions"; 
export default async function TodoDetails({ params }: { params: Promise<{ todoId: string }> }) {
const { todoId } = await params;

    if (!todoId) {
        return <div>Loading...</div>;
    }

    const todo = await getTodo(todoId);

    return (
        <div>
            <h1>Todo Details</h1>
            <p>Viewing details for todo: {todoId}</p>
            <h2>{todo.data.title}</h2>
            <p>{todo.data.description}</p>
            <p>Completed: {todo.data.completed ? 'Yes' : 'No'}</p>
            </div>
        );

}