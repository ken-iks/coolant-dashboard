import React, { useState, useEffect } from 'react';
import { getAuth, User } from 'firebase/auth';
import { auth } from './firebaseConfig'
import firebase from 'firebase/compat';


function useGetUser() {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    // Set up the auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            console.log(currentUser)
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
            console.log("No user signed in"); // No user is signed in
        }
        });
    // Return a cleanup function to unsubscribe when component unmounts
        return () => unsubscribe();
        }, []);
    if (currentUser) {
        console.log(currentUser);
        const userEmail = currentUser.email;
        if (userEmail) {
            if ((userEmail) === 'product@bumi-terra.com') {
                return 'bumiterra';
            }
            return userEmail.split('@')[0];
        }
    }
    return "Error";
}

export default useGetUser;