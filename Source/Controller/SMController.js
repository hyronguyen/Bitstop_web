import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';
import { Timestamp } from 'firebase/firestore';  // Import the Timestamp class

export const getSMItems = async (req, res) => {
    try {
        // Create a query to filter SM items
        const SMCollection = collection(db, 'SM');
        const smQuery = query(
            SMCollection,
            where('sm_type', '==', 'Output'), // Filter for sm_type = "Output"
            where('sm_status', '==', 'Processing') // Filter for sm_status = "progressing"
        );

        // Execute the query
        const querySnapshot = await getDocs(smQuery);
        const smItems = []; // Array to hold the results

        // Loop through each document and push the id and data to the smItems array
        querySnapshot.forEach(doc => {
            smItems.push({ sm_id: doc.id, ...doc.data() });
        });

        // Send back a successful response with the smItems array
        res.status(200).json(smItems);
    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({ error: error.message });
    }
};


