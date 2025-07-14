export default async function Page({
  params,
}: {
  params: Promise<{ board: string }>;
}) {
  const { board } = await params;
  if (!board) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1>{board}</h1>
      <p>This is the user boards page content.</p>
    </div>
  );
}
