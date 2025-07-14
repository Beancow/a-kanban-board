'use client';
import { firebaseAuth } from "firebase-config";
import { useAuth } from "../components/AuthProvider";

export default function UserPage() {
    const user = useAuth().user?.displayName;

    return (
        <div>
        <h1>{user ?? 'User Page'}</h1>
        <p>List of boards</p>
        { user ? (
            <span>
            <p>Welcome, {user}!</p>
            <button onClick={() => firebaseAuth.signOut()}>logout</button>
            </span>
           ) : (
            <span>
            <p>Please log in to see your boards.</p>
            </span>
        )}
        </div>
    );
}