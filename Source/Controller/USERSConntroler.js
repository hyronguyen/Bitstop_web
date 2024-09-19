import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
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


// cập nhật thông tin người dùng
export const EditProfile = async (req, res) => {
    try {
        const { DocID } = req.params;
        const { Fullname, Mail, Address, Phone } = req.body;

        const userDocRef = doc(db, 'USERS', DocID);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();

            // Kiểm tra xem Mail có trùng với doc nào khác không
            if (Mail) {
                const mailQuery = query(collection(db, 'USERS'), where('user_mail', '==', Mail), where('__name__', '!=', DocID));
                const mailSnapshot = await getDocs(mailQuery);
                if (!mailSnapshot.empty) {
                    return res.status(400).json({ message: "Email is already in use by another user." });
                }
            }

            // Kiểm tra xem Phone có trùng với doc nào khác không
            if (Phone) {
                const phoneQuery = query(collection(db, 'USERS'), where('user_phone', '==', Phone), where('__name__', '!=', DocID));
                const phoneSnapshot = await getDocs(phoneQuery);
                if (!phoneSnapshot.empty) {
                    return res.status(400).json({ message: "Phone number is already in use by another user." });
                }
            }

            // Nếu không có trùng lặp, tiếp tục cập nhật thông tin
            const updatedData = {
                user_fullname: Fullname ?? userData.user_fullname,
                user_mail: Mail ?? userData.user_mail,
                user_address: Address ?? userData.user_address,
                user_phone: Phone ?? userData.user_phone,
                user_role: userData.user_role,
                user_credit: userData.user_credit
            };

            await updateDoc(userDocRef, updatedData);

            res.status(200).json({ message: "Profile updated successfully", updatedData });
        } else {
            res.status(404).json({ message: "User not found" });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
