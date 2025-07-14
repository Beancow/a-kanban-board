"use client";
import { firebaseAuth } from "firebase-config";
import { useAuth } from "./components/AuthProvider";

export default function Home() {
  const user = useAuth().user;
  firebaseAuth.onAuthStateChanged((user) => {
    if (user) {
      console.log("User is signed in:", user);
    } else {
      console.log("No user is signed in.");
    }
  });
  return (
    <>hello {user ? user.displayName : "Guest"}</>
  );
}
