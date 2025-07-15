'use client';
import { firebaseAuth } from "firebase-config";
import { useAuth } from "../components/AuthProvider";
import Link from "next/link";
import { Button } from "@radix-ui/themes";

export default function UserPage() {
    const { user } = useAuth();
    if (!user) {
        return <p>Please log in to see your boards.</p>;
    }
    const { uid, displayName } = user;
    return (
        <div>
        <h1>{displayName ?? 'User Page'}</h1>
        <p>List of boards</p>
        { user ? (
            <span>
            <p>Welcome, {displayName}!</p>
            <Button variant="solid" size="2" color="green">
                <Link href={`/user/${uid}/create`}>Create a Todo</Link>
            </Button>
            <Button variant="solid" size="2" color="blue">
                <Link href={`/user/${uid}/todos`}>Go to your Todos</Link>
            </Button>
            <Button variant="solid" size="2" color="red" onClick={() => firebaseAuth().signOut()}>logout</Button>            
            </span>
           ) : (
            <span>
            <p>Please log in to see your boards.</p>
            </span>
        )}
        </div>
    );
}