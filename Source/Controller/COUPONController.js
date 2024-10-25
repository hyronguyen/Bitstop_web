import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
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
            console.log(orderData); // Log the raw order data

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
