import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';


export const CreateANewOrder = async (req, res) => {
    const { customerId,customerName, customerAddress, customerPhone, subtotal, items } = req.body;

    // Check for mandatory fields
    if (!customerName || !customerAddress || !customerPhone || !customerId || !items) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const orderData = {
            or_cid: customerId,
            or_name: customerName,
            or_address: customerAddress,
            or_phone: customerPhone,
            or_subtotal: subtotal,
            or_items: items,
            or_date: "00/00/0000",
            or_status: 'Processing'
        };

        // Save the order to Firestore using addDoc
        const docRef = await addDoc(collection(db, 'ORDERS'), orderData);

        // Log the document ID
        console.log('Order created with ID:', docRef.id);

        // Respond with the document ID
        res.status(201).json({ message: `Order created with ID: ${docRef.id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};