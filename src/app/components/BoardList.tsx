import { getBoards } from "@/app/actions";
import { Button, Flex } from "@radix-ui/themes";
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
    
    return (
        <Flex direction="column" gap="4">
            <Button variant="solid" size="2" color="green" style={{ maxWidth: '200px' }}>
                <Link href={`/user/${uid}/boards/createBoard`}>
                    Create New Board
                </Link>
            </Button>
            {boards.map((board) => (
                <Button key={board.id} variant="solid" size="2" style={{ maxWidth: '200px', textAlign: 'left' }}>
                    <Link href={`/user/${uid}/boards/${board.id}/todos`}>
                        {board.data.title}
                    </Link>
                </Button>
            ))}
        </Flex>
    );
}