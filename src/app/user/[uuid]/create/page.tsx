"use client";
import Form from "next/form";
import { createTodo } from '../../../actions'


export default async function CreateTodo({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;
    const handleSubmit = (data: FormData) => {
        createTodo(data, uuid);
    }

    return (
        <div>
            <h1>Create Todo</h1>
            <p>Fill out the form below to create a new todo item.</p>
        <Form action={handleSubmit}>
            <div>
                <label htmlFor="title">Title:</label>
                <input type="text" name="title" id="title" required />
            </div>
            <div>
                <label htmlFor="description">Description:</label>
                <textarea name="description" id="description" required></textarea>
            </div>
            <button type="submit">Create Todo</button>
        </Form>
    </div>
    );
}
