import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';

// Lấy tất cả người dùng
export const getAllProduct = async (req, res) => {
    try {
        const productsCollection = collection(db, 'PRODUCTS');
        const productsSnapshot = await getDocs(productsCollection);

       
        const productsList = productsSnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,  
                title: data.pro_title || "No title",  
                category: data.pro_category || "No category",
                price: data.pro_price || 0,
                platform: data.pro_platform || "Unknown platform",
                img: data.pro_img || "No image available",
                des: data.pro_des || "No description"
            };
        });

        res.json(productsList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// lấy sản phẩm theo platform
export const getProductbyPlatform = async (req, res) => {
    try {
        const { productPlat } = req.params; // The platform you're searching for (e.g., "PS5")
        const productsCollection = collection(db, 'PRODUCTS');
        const querySnapshot = await getDocs(productsCollection);
        
        // Filter products where 'productPlat' matches one of the platforms in the 'pro_platform' field
        const products = querySnapshot.docs
            .map(doc => {
                const data = doc.data(); 
                const platforms = data.pro_platform ? data.pro_platform.split(',') : []; // Split platforms into an array
                return {
                    id: doc.id,
                    title: data.pro_title || "No title",  
                    category: data.pro_category || "No category",
                    price: data.pro_price || 0,
                    platform: data.pro_platform || "Unknown platform",
                    img: data.pro_img || "No image available",
                    platforms: platforms,
                    des:data.pro_des // store platforms as an array for filtering
                };
            })
            .filter(product => product.platforms.includes(productPlat)); // Filter by matching platform

        // Respond with the filtered products
        res.status(200).json(products);
    } catch (error) {
        console.error("Error retrieving products by platform: ", error);
        res.status(500).json({ message: 'Failed to fetch products by platform.' });
    }
};


