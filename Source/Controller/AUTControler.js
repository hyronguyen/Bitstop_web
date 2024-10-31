import bcrypt from 'bcryptjs';
import {generateToken} from '../Utils/jasonwebtoken.js';
import db from '../Configs/firestore.js'; // Your Firestore DB configuration
import { collection, query, where, getDocs,addDoc } from 'firebase/firestore';

// Đăng ký
export const registerUser = async (req, res) => {
  const { user_mail, user_password, user_name, user_fullname } = req.body;

  // Check for mandatory fields
  if (!user_mail || !user_password || !user_name || !user_fullname) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(user_password, 10);

    // Save the user to Firestore using addDoc
    const docRef = await addDoc(collection(db, 'USERS'), {
        user_mail,
        user_password: hashedPassword,
        user_name,
        user_fullname,
        user_address:'', // Default to empty string if not provided
        user_role:'',       // Default to empty string if not provided
        user_credit: 0,                   // Default credit value
        user_phone:''      // Default to empty string if not provided
    });

    // Log the document ID
    console.log('User registered with ID:', docRef.id);

    // Respond with the document ID
    res.status(201).json({ message: `User registered with ID: ${docRef.id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Đăng nhập
export const loginUser = async (req, res) => {
  const { user_name, user_password } = req.body;

  try {
    // Tìm user
    const usersCollection = collection(db, 'USERS');
    const q = query(usersCollection, where('user_name', '==', user_name));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(user_password, userData.user_password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const user = { 
      id: userDoc.id 
    };

    // Generate a JWT token for the user
    const token = generateToken(user);

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
