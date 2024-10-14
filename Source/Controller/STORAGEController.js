import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';

// Lấy tất cả sản phẩm
export const getStorgeItems = async (req, res) => {
    try {
        const storageCollection = collection(db, 'STORAGE');
        const storageSnapshot = await getDocs(storageCollection);


        const storageList = await Promise.all(storageSnapshot.docs.map(async storageDoc => {
            const data = storageDoc.data();
            let productDetails = {};

            if (data.sto_product) {
                const productDocRef = doc(db, 'PRODUCTS', data.sto_product); 
                const productDoc = await getDoc(productDocRef);
                if (productDoc.exists()) {
                    productDetails = productDoc.data(); 
                }
            }

            return {
                sto_product: data.sto_product,
                sto_qa: data.sto_qa || "0",
                pro_title: productDetails.pro_title || "Unknown Product",
                pro_price: productDetails.pro_price || "N/A",
                pro_category:productDetails.pro_category,
                pro_platform:productDetails.pro_platform,
                pro_img:productDetails.pro_img
            };
        }));

        res.json(storageList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy thông tin từ PURCHASE
export const getPurchaseItems = async (req, res) => {
    try {
        const purchaseCollection = collection(db, 'PURCHASE');
        const purchaseSnapshot = await getDocs(purchaseCollection);

        // Map through each purchase document and return its data
        const purchaseList = purchaseSnapshot.docs.map(purchaseDoc => {
            const purchaseData = purchaseDoc.data();

            return {
                id: purchaseDoc.id,
                pur_invo: purchaseData.pur_invo || "No Invo",
                pur_ncc: purchaseData.pur_ncc || "Unknown Supplier",
                pur_res: purchaseData.pur_res || "Unknown Staff",
                pur_date: purchaseData.pur_date.toDate().toLocaleDateString(), // Format purchase date
                pur_status: purchaseData.pur_status || "Processing",
                pur_items: purchaseData.pur_items || [] // Items array directly from PURCHAS
            };
        });

        // Send the purchase data as JSON
        res.json(purchaseList);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ error: error.message });
    }
};

//cập nhật số lượng kho
export const updateStorageQuantity = async (req, res) => {
    const { identify, qa } = req.body;

    try {
        const storageCollectionRef = collection(db, 'STORAGE');
        const q = query(storageCollectionRef, where('sto_product', '==', identify));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log('Product not found in storage');
            return res.status(404).json({ error: 'Product not found in storage' });
        }

        const storageDoc = querySnapshot.docs[0];

        // Lấy số lượng hiện tại
        const currentQuantity = storageDoc.data().sto_qa || 0;

        // Tính số lượng mới
        const newQuantity = currentQuantity + qa;
        await updateDoc(storageDoc.ref, { sto_qa: newQuantity });

        console.log('Product quantity updated successfully');
        res.status(200).json({ message: 'Product quantity updated successfully in storage' });
    } catch (error) {
        console.error('Error updating product quantity:', error); 
        res.status(500).json({ error: error.message });
    }
};


export const updatePurchaseStatus = async (req, res) => {
    if (!req.body || !req.body.purchaseId) {
        console.error('Invalid request body:', req.body);
        return res.status(400).json({ error: 'Purchase ID is required' });
    }

    const { purchaseId } = req.body;

    console.log('Updating purchase status for ID:', purchaseId);

    try {
        // Reference directly to the specific document by its ID
        const purchaseDocRef = doc(db, 'PURCHASE', purchaseId);

        // Update the 'pur_status' field to 'Delivered'
        await updateDoc(purchaseDocRef, { pur_status: 'Delivered' });

        console.log('Purchase status updated to Delivered');
        res.status(200).json({ message: 'Purchase status updated to Delivered' });
    } catch (error) {
        console.error('Error updating purchase status:', error);
        res.status(500).json({ error: error.message });
    }
};


export const createSMInput = async (req, res) => {
    const { purchaseId, smItems, smDes } = req.body;

    try {
        // Create a new SM document
        const newSMDoc = {
            sm_purchaseId: purchaseId,   // Link to the related purchase
            sm_items: smItems,           // Assuming smItems is an array of the items from purchase
            sm_des: smDes,               // Description
            sm_type: 'Input for invoice',            // Type is always 'Input'
            sm_status: 'Processing',     // Default status for a new SM
            createdAt: new Date()        // Timestamp
        };

        // Add the new SM document to the 'SM' collection
        const smDocRef = await addDoc(collection(db, 'SM'), newSMDoc);

        console.log('New SM Input created with ID:', smDocRef.id);
        res.status(201).json({ message: 'SM Input created', id: smDocRef.id });
    } catch (error) {
        console.error('Error creating SM Input:', error);
        res.status(500).json({ error: error.message });
    }
};