import { db } from './firebaseConfig';
import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import useGetUser from './getuser';

/* WORK IN PROGRESS!!!

This function should be able to generate the project based on a unique project name. But,
right now it can only be used on the project details page, but should be able to be used for
the rest with not too much work. Before using in a component, always check if project==null, 
as this will re render if the asynchronous request hasnt been met yet.

I think the best bet in the long run may be to migrate away from firestore, as I dont think
the API is as intuitive as other options such as MongoDB etc. Probably will make backend 
integration far easier than it has been. Using Custom React Hooks (any function that has 'use' 
at the beginning of it) can be very finicky.

*/
function useGetModel() {
    const [project, setProject] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const name = useGetUser();
    console.log(name);

    const docRef = doc(db, "users", name);

    useEffect(() => {
        try {
        const fetchNames = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                console.log("Document data:", data);
                // Because data.projects only has 1 model right now, will need to expand
                const modelname = data.projects[0];
                const modelRef = doc(db, "projects", modelname);
                const modelDoc = await getDoc(modelRef);
                if (modelDoc.exists()) {
                    setProject(modelDoc.data());
                    setIsLoading(false);
                }
                else {
                    console.log("No model exists with name, " + modelname);
                }
            }
            else {
                console.log("No user with name, " + name);
            }
        }
        fetchNames(); } catch(error) {
            console.error("Error fetching data: ", error);
        }
    }, [name])
    if (isLoading) {
        return null
    }
    return project;
}

export default useGetModel;
