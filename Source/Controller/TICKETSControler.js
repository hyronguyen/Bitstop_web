import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';

// Get ticket với userID
export const GetTicketByCID = async (req, res) => {
    const { customerId } = req.params;

    if (!customerId) {
        return res.status(400).json({ error: 'Missing customerId' });
    }

    try {
        const q = query(collection(db, 'TICKETS'), where('tic_user', '==', customerId));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'No Tickets found for this customer' });
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

// lấy tất cả Ticket
export const GetAllTickets = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, 'TICKETS'));
        const orders = [];

        querySnapshot.forEach(doc => {
            orders.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật trạng thái tick
export const DoneStatusTicket = async (req, res) => {
    const { ticketId } = req.params; 

    if (!ticketId) {
        return res.status(400).json({ error: 'Ticket ID is required' });
    }

    try {
        const orderDocRef = doc(db, 'TICKETS', ticketId);
        
        // Fetch the order document
        const orderDoc = await getDoc(orderDocRef);
        // Check if the order exists
        if (!orderDoc.exists()) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        // Update the sm_status field to 'Delivering'
        await updateDoc(orderDocRef, {
            tic_status: 'Done',
        });

        res.status(200).json({ message: `Ticket ${ticketId} is now Done` });
    } catch (error) {
        console.error('Error updating delivery order:', error);
        res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
};

export const CreateANewTicket = async (req, res) => {
    const { customerId,customerName,customerMail, ticketDescription, orderId } = req.body;

    if (!customerName || !customerMail || !ticketDescription || !customerId) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const TicketData = {
            tic_date: new Date(),
            tic_des:ticketDescription,
            tic_mail:customerMail,
            tic_name:customerName,
            tic_order:orderId || "No Order",
            tic_status:"Request",
            tic_user:customerId
          
        };
        const docRef = await addDoc(collection(db, 'TICKETS'), TicketData);
        res.status(201).json({ message: `Ticket created with ID: ${docRef.id}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
