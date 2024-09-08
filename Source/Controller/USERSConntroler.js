import { collection, getDocs, addDoc } from 'firebase/firestore';
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

// Tạo người dùng mới
export const createUser = async (req, res) => {
    try {
        const newUser = req.body;
        const docRef = await addDoc(collection(db, 'USERS'), newUser);
        res.json({ message: 'User created', userId: docRef.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
