import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';


export const getCoupons = async (req, res) => {
    try {
        // Create a reference to the 'COUPONS' collection
        const couponsCollection = collection(db, 'COUPON');
        
        // Get all documents from the 'COUPONS' collection
        const querySnapshot = await getDocs(couponsCollection);
        const coupons = []; // Array to hold the results

        // Loop through each document and push the id and data to the coupons array
        querySnapshot.forEach(doc => {
            coupons.push({ cou_id: doc.id, ...doc.data() });
        });

        // Send back a successful response with the coupons array
        res.status(200).json(coupons);
    } catch (error) {
        // Handle errors gracefully
        res.status(500).json({ error: error.message });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const orderCollection = collection(db, 'ORDERS');
        const querySnapshot = await getDocs(orderCollection);
        const orders = [];

        querySnapshot.forEach(doc => {
            const orderData = doc.data();

            orders.push({
                id: doc.id,
                or_name: orderData.or_name,
                or_address: orderData.or_address,
                or_phone: orderData.or_phone,
                or_date: orderData.or_date?.toDate ? orderData.or_date.toDate().toLocaleString() : 'No Date Available',
                or_payment: orderData.or_payment,
                or_status: orderData.or_status,
                or_subtotal: orderData.or_subtotal,
                or_invo: orderData.or_invo,
                or_items: orderData.or_items ? orderData.or_items.map(item => ({
                    id: item.id,
                    title: item.title,
                    quantity: item.quantity,
                    total: item.total,
                })) : [] // Handle case where or_items might be undefined
            });
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const addNewCoupon = async (req, res) => {
    try {
        const { cou_exp, cou_discount, cou_user, cou_status } = req.body;

        // Validate input
        if (!cou_exp || !cou_discount) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const newCoupon = {
            cou_discount: `${cou_discount}`, // Add '%' to discount
            cou_exp: new Date(cou_exp), // Convert to Date object
            cou_user: cou_user || 'all', // Default to 'all' if no user provided
            cou_status: cou_status || 'available', // Default to 'available'
        };

        // Add the coupon to the Firestore database
        const couponsCollection = collection(db, 'COUPON');
        const docRef = await addDoc(couponsCollection, newCoupon);

        res.status(201).json({ id: docRef.id, ...newCoupon });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCouponsbyUser = async (req, res) => {
    try {
        // Extract user ID from request parameters
        const { iduser } = req.params; 

        if (!iduser) {
            return res.status(400).json({ error: 'Missing user ID' });
        }

        // Query to find coupons associated with the user
        const q = query(collection(db, 'COUPON'), where('cou_user', '==', iduser));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No coupons found for this user' });
        }

        const coupons = [];
        querySnapshot.forEach(doc => {
            coupons.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};