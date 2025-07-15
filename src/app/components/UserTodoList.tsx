import { getTodos } from "@/app/actions";
export default async function UserTodoList({ uuid }: { uuid: string }) {
    const { data: todos } = await getTodos(uuid);
    if (!todos || todos.length === 0) {
        return <p>No todos found.</p>;
    }

    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
                    <a href={`/user/${uuid}/todo/${todo.id}`}>{todo.data.title}</a>
                </li>
            ))}
        </ul>
    );
}
