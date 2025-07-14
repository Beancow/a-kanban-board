import Form from "next/form";
import { createTodo } from '../../../actions'


export default function CreateTodo() {
    const handleSubmit = async (data: FormData) => {
        'use server';

        try {
            const result = await createTodo(data);
            console.log('Todo created successfully:', result.data);
        } catch (error) {
            console.error('Error creating todo:', error);
        }
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
