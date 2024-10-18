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

export const updateSMStatus = async (req, res) => {
    try {
        console.log('Request received at /update_SMStatus:', req.body); // Add this line
        const { sm_id, sm_status } = req.body;

        if (!sm_id || !sm_status) {
            return res.status(400).json({ message: 'Missing required fields: sm_id or sm_status' });
        }

        const smDocRef = doc(db, 'SM', sm_id);
        await updateDoc(smDocRef, {
            sm_status: sm_status,
        });

        res.status(200).json({ message: `SM status updated to "${sm_status}"`, sm_id });
    } catch (error) {
        console.error('Error updating SM status:', error.message);
        res.status(500).json({ error: error.message });
    }
};

export const getDoneSMItems = async (req, res) => {
    try {
        // Create a query to filter SM items
        const SMCollection = collection(db, 'SM');
        const smQuery = query(
            SMCollection,
            where('sm_type', '==', 'Output'), // Filter for sm_type = "Output"
            where('sm_status', '==', 'Done') // Filter for sm_status = "progressing"
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


// Controller to update product quantity
export const updateProductQuantity = async (req, res) => {
    try {
        const { productId } = req.params;  // Lấy productId từ URL params
        const { quantity } = req.body;     // Lấy quantity từ request body

        // Kiểm tra nếu quantity hợp lệ (không được âm)
        if (quantity < 0) {
            return res.status(400).json({ error: 'Quantity cannot be negative' });
        }

        // Tạo tham chiếu đến document của sản phẩm cần cập nhật
        const productDoc = doc(db, 'products', productId);

        // Cập nhật trường quantity
        await updateDoc(productDoc, { quantity: quantity });

        // Trả về phản hồi thành công
        res.status(200).json({ message: 'Product quantity updated successfully' });
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({ error: error.message });
    }
};
