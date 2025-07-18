"use client";
import { useAppState } from "@/app/components/AppStateProvider"; 

export default function Page() {
    const { todos, setTodos } = useAppState();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const completed = formData.get("completed") === "on";
        const createdAt = new Date();
        const updatedAt = new Date();
        const boardId = formData.get("boardId") as string;

        // Simulate API call to create a new board
        const newTodo = {
            id: Math.random().toString(36).substring(2, 15), // Generate a random ID
            userId: '1',
            title,
            description,
            completed,
            createdAt,
            updatedAt,
            boardId,
        }

        // Update the todos state
        setTodos([...todos, newTodo]);

        // Optionally, redirect to the new board's page
        return `/user/${1}/boards/${newTodo.boardId}/todos`;
    }

        
    return (
        <div>
            <h1>Create Board</h1>
            <p>Fill out the form below to create a new board.</p>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" id="title" required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" required></textarea>
                </div>
                <div>
                    <label htmlFor="completed">Completed:</label>
                    <input type="checkbox" name="completed" id="completed" />
                </div>
                <div>
                    <label htmlFor="createdAt">Created At:</label>
                    <input type="datetime-local" name="createdAt" id="createdAt" defaultValue={new Date().toISOString().slice(0, 16)} />
                </div>
                <div>
                    <label htmlFor="updatedAt">Updated At:</label>
                    <input type="datetime-local" name="updatedAt" id="updatedAt" defaultValue={new Date().toISOString().slice(0, 16)} />
                </div>
                <div>
                    <label htmlFor="boardId">Board ID:</label>
                    <input type="text" name="boardId" id="boardId" value={1752771419502} readOnly />
                </div>
                <button type="submit">Create Board</button>
            </form>
        </div>
    );
}