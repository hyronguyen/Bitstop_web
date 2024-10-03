import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';

// Tạo đơn hàng purchase mới
export const CreateANewPurchaseOrder = async (req, res) => {
    const { purchaseNCC, purchaseItems } = req.body;

    // Validate required fields
    if (!purchaseNCC || !purchaseItems || purchaseItems.length === 0) {
        return res.status(400).json({ error: 'Missing required fields or empty purchase items' });
    }
    try {
        // Prepare the purchase order data
        const purchaseData = {
            pur_invo: "", // You can generate or fill this field later if needed
            pur_res: "Purchase staff", // This could be dynamic based on logged-in user
            pur_ncc: purchaseNCC,
            pur_items: purchaseItems,
            pur_date: new Date(),
            pur_status: 'Processing',
        };
        // Add the document to Firestore in the 'PURCHASE' collection
        const docRef = await addDoc(collection(db, 'PURCHASE'), purchaseData);
        // Send success response with the created document ID
        res.status(201).json({ message: `Purchase created with ID: ${docRef.id}`});
    } catch (error) {
        // Catch and handle any errors during Firestore interaction
        res.status(500).json({ error: error.message });
    }
};