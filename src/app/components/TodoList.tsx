import { getTodos } from "@/app/actions";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
export default async function UserTodoList({ params }: { params: Promise<{ uid: string, boardId: string }> }) {
    const { uid, boardId } = await params;
    const { data: todos } = await getTodos(uid, boardId);
    if (!todos || todos.length === 0) {
        return (
            <>
                <p>No todos found.</p>
                <Button variant="solid" size="2" color="green">
                    <Link href={`/user/${uid}/boards/${boardId}/createTodo`}>Create Todo</Link>
                </Button>
            </>
        );
    }

    return (
        <main>
        <Button variant="solid" size="2" color="green">
            <Link href={`/user/${uid}/boards/${boardId}/createTodo`}>Create Todo</Link>
        </Button>
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
                    <a href={`/user/${uid}/boards/${boardId}/todos/${todo.id}`}>{todo.data.title}</a>
                </li>
            ))}
        </ul>
        </main>
    );
}
