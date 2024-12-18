import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';
import {createOrderPDF} from "../Utils/pdfMaker.js";


// Tạo đơn hành mới
export const CreateANewOrder = async (req, res) => {
    const { customerId,customerName, customerAddress, customerPhone, subtotal, items, payment } = req.body;

    if (!customerName || !customerAddress || !customerPhone || !customerId || !items) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const orderData = {
            or_invo:"",
            or_cid: customerId,
            or_name: customerName,
            or_address: customerAddress,
            or_phone: customerPhone,
            or_subtotal: subtotal,
            or_items: items,
            or_date: new Date(),
            or_status: 'Processing',
            or_payment:payment || 'No method'
        };


        const docRef = await addDoc(collection(db, 'ORDERS'), orderData);

        const newSMDoc = {
            sm_items: items,           
            sm_des: 'Output for order:' + docRef.id,               
            sm_type:  'Output',            
            sm_status: 'Processing',     
            sm_date: new Date(),
            sm_res: `Stock Staff`     
        };

        const SMRef = await addDoc(collection(db,'SM'),newSMDoc);


        const invoiceResult = await createOrderPDF(orderData,docRef.id);
        await updateDoc(doc(db, 'ORDERS', docRef.id), {
            or_invo: invoiceResult.fileURL // Update the pur_invo field with the fileURL
        });

        res.status(201).json({ message: `Order created with ID: ${docRef.id} and resquest ${SMRef.id}` });
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

// lấy order theo id order
export const GetOrderByID = async (req, res) => {
    const { orderId } = req.params;

    if (!orderId) {
        return res.status(400).json({ error: 'Missing orderId' });
    }

    try {
        // Lấy tài liệu theo document ID (orderId)
        const orderDocRef = doc(db, 'ORDERS', orderId);  
        const orderDoc = await getDoc(orderDocRef);  // Sử dụng getDoc để lấy tài liệu

        if (!orderDoc.exists()) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Trả về thông tin đơn hàng
        res.status(200).json({ id: orderDoc.id, ...orderDoc.data() });
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

// cập nhật trạng thái "Đang vận chuyển
export const updateDeliveryOrder = async (req, res) => {
    const { orderId } = req.params; 

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
        const orderDocRef = doc(db, 'ORDERS', orderId);
        
        // Fetch the order document
        const orderDoc = await getDoc(orderDocRef);
        // Check if the order exists
        if (!orderDoc.exists()) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Update the sm_status field to 'Delivering'
        await updateDoc(orderDocRef, {
            or_status: 'Delivering',
        });

        res.status(200).json({ message: `Order ${orderId} is now being delivered.` });
    } catch (error) {
        console.error('Error updating delivery order:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

// cập nhật trạng thái "Yêu cầu hủy"
export const CancelRequest = async (req, res) => {
    const { orderId } = req.params; 

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
        const orderDocRef = doc(db, 'ORDERS', orderId);
        
        // Fetch the order document
        const orderDoc = await getDoc(orderDocRef);
        // Check if the order exists
        if (!orderDoc.exists()) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Cập nhật trạng thái đang yêu cầu hủy
        await updateDoc(orderDocRef, {
            or_status: 'Request',
        });

        res.status(200).json({ message: `Order ${orderId} is now being request for canceling.` });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

// cập nhật trạng thái "Đã hủy"
export const CancelOrder = async (req, res) => {
    const { orderId } = req.params; 

    if (!orderId) {
        return res.status(400).json({ error: 'Order ID is required' });
    }

    try {
        const orderDocRef = doc(db, 'ORDERS', orderId);
        
        // Fetch the order document
        const orderDoc = await getDoc(orderDocRef);
        // Check if the order exists
        if (!orderDoc.exists()) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Cập nhật trạng thái đang yêu cầu hủy
        await updateDoc(orderDocRef, {
            or_status: 'Canceled',
        });

        res.status(200).json({ message: `Order ${orderId} is now Canceled` });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};