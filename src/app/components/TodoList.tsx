import { getTodos } from "@/app/actions";
import { Button, Flex } from "@radix-ui/themes";
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
        <Flex direction="column" gap="4">
            <Button variant="solid" size="2" color="green" style={{ maxWidth: '200px' }}>
                <Link href={`/user/${uid}/boards/${boardId}/createTodo`}>Create Todo</Link>
            </Button>
                {todos.map((todo) => (
                <Button key={todo.id} variant="solid" size="2" style={{  maxWidth: '200px', textAlign: 'left' }}>
                    <Link href={`/user/${uid}/boards/${boardId}/todos/${todo.id}`}>
                        {todo.data.title}
                    </Link>
                </Button>
            ))}
        </Flex>
    );
}
