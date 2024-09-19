import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';


// Tạo đơn hành mới
export const CreateANewOrder = async (req, res) => {
    const { customerId,customerName, customerAddress, customerPhone, subtotal, items, payment } = req.body;

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
            or_date: new Date(),
            or_status: 'Processing',
            or_payment:payment
        };

        const docRef = await addDoc(collection(db, 'ORDERS'), orderData);

        res.status(201).json({ message: `Order created with ID: ${docRef.id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tham chiếu đơn hàng với mã khách hàng
export const GetOrderByCID = async (req, res) => {
    const { customerId } = req.params;

    if (!customerId) {
        return res.status(400).json({ error: 'Missing customerId' });
    }

    try {
        const q = query(collection(db, 'ORDERS'), where('or_cid', '==', customerId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No orders found for this customer' });
        }

        const orders = [];
        querySnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tham chiếu tất cả đơn hàng
export const GetAllOrder = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'ORDERS'));
        const orders = [];

        querySnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tham chiếu đơn hàng đang được xử lý
export const GetAllProcessingOrder = async (req, res) => {
    try {
        const q = query(collection(db, 'ORDERS'), where('or_status', '==', 'Processing'));
        const querySnapshot = await getDocs(q);

        const orders = [];
        querySnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Tham chiếu đơn hàng đang được vận chuyển
export const GetAllDeliveringOrder = async (req, res) => {
    try {
        const q = query(collection(db, 'ORDERS'), where('or_status', '==', 'Delivering'));
        const querySnapshot = await getDocs(q);

        const orders = [];
        querySnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// tham chiếu đơn hàng đã thành công

export const GetAllSuccedOrder = async (req, res) => {
    try {
        const q = query(collection(db, 'ORDERS'), where('or_status', '==', 'Succeeded'));
        const querySnapshot = await getDocs(q);

        const orders = [];
        querySnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

