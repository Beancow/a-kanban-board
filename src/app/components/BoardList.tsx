import { getBoards } from "@/app/actions";
import Link from "next/link";
export default async function BoardList({ uid }: { uid: string }) {
    const { data:boards } = await getBoards(uid);

    if (!boards || boards.length === 0) {
        return (
            <>
                <p>No boards found.</p>
                <Link href={`/user/${uid}/boards/createBoard`}>
                    Create New Board
                </Link>
            </>
        );
    }
    
    console.log('Boards:', boards);

    return (
        <main>
        <Link href={`/user/${uid}/boards/createBoard`}>
                Create New Board
        </Link>
        <ul>
            {boards.map((board) => (
                <li key={board.id}>
                    <a href={`/user/${uid}/boards/${board.id}/todos`}>{board.data.title}</a>
                </li>
            ))}
        </ul>
        </main>
    );
}