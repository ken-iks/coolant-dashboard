import { useState, useEffect } from 'react';
import { auth } from './firebaseConfig'
import firebase from 'firebase/compat';

// Function to get user name based on the current logged in user's email
function useGetUser() {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    // Set up the auth state listener
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            console.log(user);
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
            console.log("No user signed in");
        }
        });
    // Return a cleanup function to unsubscribe when component unmounts
        return () => unsubscribe();
        }, []);
        
    if (currentUser) {
        console.log(currentUser);
        const userEmail = currentUser.email;
        console.log(userEmail);
        // Hard coding bumiterra's email. Best bet is it have name saved in Firebase
        // TODO: Find a better way to connect user name's to user emails (best bet may be to store on backend)
        if (userEmail) {
            if ((userEmail) === 'product@bumi-terra.com' || (userEmail) === 'pilot@coolant.earth') {
                console.log("nice");
                return 'bumiterra';
            }
            return userEmail.split('@')[0];
        }
    }
    return "Error. User not logged in";
}

export default useGetUser;