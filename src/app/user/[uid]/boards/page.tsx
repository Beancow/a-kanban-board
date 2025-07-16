import dynamic from "next/dynamic";

const BoardList = dynamic(() => import('@/app/components/BoardList'), {
    ssr: true,
});

export default async function Page({ params }: { params: Promise<{ uid: string }> }) {
    const { uid } = await params;
    return (
        <div>
            <h1>User Boards</h1>
            <p>Here you can view and manage your boards.</p>
            <BoardList uid={uid} />
        </div>
    );
}
