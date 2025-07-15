import Link from "next/link";

export default function Home() {
 
  return (
    <main>
    <h1>Welcome to Avery's Kanban Board!</h1>
    <p>This is a simple Kanban board application built with Next.js and Firebase.</p>
    <p>To get started, please log in to see your boards.</p>
    <p>Click on the "User" link in the navigation to access your boards.</p>

    <Link href="/user">Login</Link>
    </main>
  );
}
