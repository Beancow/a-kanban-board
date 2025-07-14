import { getTodos } from "@/app/actions";
export default async function UserTodoList() {
    const { data:todos } = await getTodos();
    console.log('Todos:', todos);
    
    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>
                    <a href={`/user/todo/${todo.id}`}>{todo.title}</a>
                </li>
            ))}
        </ul>
    );
}
