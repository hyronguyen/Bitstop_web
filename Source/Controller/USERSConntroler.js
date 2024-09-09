import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';

// Lấy tất cả người dùng
export const getAllUsers = async (req, res) => {
    try {
        const usersCollection = collection(db, 'USERS');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => doc.data());
        res.json(usersList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// lấy thông tin tài khoản
export const getUserByDocId = async (req, res) => {
    try {
        const { DocID } = req.params; // E

        const userDocRef = doc(db, 'USERS', DocID); 
        const userDoc = await getDoc(userDocRef);   
        const userData = userDoc.data();

        if (userDoc.exists()) {
            res.status(200).json({
                user_mail:userData.user_mail ,
                user_name:userData.user_name,
                user_fullname:userData.user_fullname,
                user_address:userData.user_address, 
                user_role:userData.user_role,      
                user_credit:userData.user_credit,                  
                user_phone:userData.user_phone 
            });
        } else {
            res.status(404).json({ message: "User not found" }); 
        }

    } catch (error) {
        res.status(500).json({ message: error.message });  
    }
};