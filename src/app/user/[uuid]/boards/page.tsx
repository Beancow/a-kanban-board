import dynamic from "next/dynamic";

const BoardList = dynamic(() => import('@/app/components/BoardList'), {
    ssr: true,
});

export default function UserBoards() {
    return (
        <div>
            <h1>User Boards</h1>
            <BoardList />
        </div>
    );
}
