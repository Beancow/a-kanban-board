import Form from "next/form";
import { createBoard } from '@/app/actions'
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ uid: string, boardId: string }> }) {
    const { uid } = await params;

    async function handleSubmit(data: FormData) {
        "use server";
        await createBoard(data, uid);
        redirect(`/user/${uid}/boards`);
    }
    
    return (
        <div>
            <h1>Create Board</h1>
            <p>Fill out the form below to create a new board.</p>
            <Form action={handleSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" id="title" required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" required></textarea>
                </div>
                <button type="submit">Create Board</button>
            </Form>
        </div>
    );
}