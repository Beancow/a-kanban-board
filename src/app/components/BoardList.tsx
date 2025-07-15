import { getBoards } from "@/app/actions";
export default async function BoardList() {
    const username = '1'; // Replace with actual username logic
    const { data:boards } = await getBoards(username);

    if (!boards || boards.length === 0) {
        return <p>No boards found.</p>;
    }
    
    console.log('Boards:', boards);

    return (
        <ul>
            {boards.map((board) => (
                <li key={board.id}>
                    <a href={`/user/board/${board.id}`}>{board.title}</a>
                </li>
            ))}
        </ul>
    );
}