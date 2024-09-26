import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';

// Lấy tất cả sản phẩm
export const getAllCategory = async (req, res) => {
    try {
        const cateCollection = collection(db, 'CATEGORIES');
        const cateSnapshot = await getDocs(cateCollection);

       
        const cateList = cateSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,  
                title: data.cate_title || "N/A"
            };
        });

        res.json(cateList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};