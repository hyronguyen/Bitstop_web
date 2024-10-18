import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';
import {createPurchaseInvoice} from "../Utils/pdfMaker.js";

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
            pur_invo: "", // We'll update this field later with the fileURL
            pur_res: "Purchase staff", // This could be dynamic based on logged-in user
            pur_ncc: purchaseNCC,
            pur_items: purchaseItems,
            pur_date: new Date(),
            pur_status: 'Processing',
        };

        // Add the document to Firestore in the 'PURCHASE' collection
        const docRef = await addDoc(collection(db, 'PURCHASE'), purchaseData);

        // Create the invoice and upload it to Firebase Storage
        const invoiceResult = await createPurchaseInvoice({ ...purchaseData, pur_invo: docRef.id });

        // Update the pur_invo field with the fileURL in the created document
        await updateDoc(doc(db, 'PURCHASE', docRef.id), {
            pur_invo: invoiceResult.fileURL // Update the pur_invo field with the fileURL
        });

        // Send success response with the created document ID and the file URL
        return res.status(201).json({
            message: `Purchase created with ID: ${docRef.id}`,
            fileURL: invoiceResult.fileURL
        });

    } catch (error) {
        // Catch and handle any errors during Firestore interaction
        res.status(500).json({ error: error.message + " Controller" });
    }
};


// Get all Purchase
export const GetAllPurchase = async (req, res) => {
    try {
            const querySnapshot = await getDocs(collection(db, 'PURCHASE'));
            const purchase = [];
    
            querySnapshot.forEach(doc => {
                purchase.push({ id: doc.id, ...doc.data() });
            });
    
            res.status(200).json(purchase);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}
