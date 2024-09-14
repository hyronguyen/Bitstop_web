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
        const { productPlat } = req.params;
        const productsCollection = collection(db, 'PRODUCTS');
        const querySnapshot = await getDocs(productsCollection);
        
       
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
                    des:data.pro_des 
                };
            })
            .filter(product => product.platforms.includes(productPlat)); 

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy sản phẩm theo Keyword
export const getProductByKeyword = async (req, res) => {
    try {
        const { keyword } = req.params;
        const keywordArray = keyword.toLowerCase().split(' ');  
     
        const productsCollection = collection(db, 'PRODUCTS');

      
        const querySnapshot = await getDocs(productsCollection);

        const products = [];


        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const titleLower = data.pro_title.toLowerCase();

     
            const anyKeywordPresent = keywordArray.some(keyword => titleLower.includes(keyword));

            if (anyKeywordPresent) {
                products.push({
                    id: doc.id,
                    title: data.pro_title || "No title",  
                    category: data.pro_category || "No category",
                    price: data.pro_price || 0,
                    platform: data.pro_platform || "Unknown platform",
                    img: data.pro_img || "No image available",
                    platforms: data.pro_platform,
                    des: data.pro_des || "No description"
                });
            }
        });

       
        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm phù hợp với từ khóa.' });
        }

       
        res.status(200).json(products);
    } catch (error) {
    
        res.status(500).json({ error: error.message });
    }
};


//lấy sản phẩm theo ID
export const getProductById = async (req, res) => {
    try {
        const { DocID } = req.params; 


        const proDocRef = doc(db, 'PRODUCTS', DocID);
        const proDoc = await getDoc(proDocRef); 

        if (proDoc.exists()) {
            const proData = proDoc.data();
            res.status(200).json({
                id: proDoc.id,
                title: proData.pro_title || "No title",  
                category: proData.pro_category || "No category",
                price: proData.pro_price || 0,
                platform: proData.pro_platform || "Unknown platform",
                img: proData.pro_img || "No image available",
                platforms: proData.platforms || [], 
                des: proData.pro_des || "No description available"
            });
        } else {
            res.status(404).json({ message: "Product not found" });
        }

    } catch (error) {
        res.status(500).json({ message: `Error fetching product: ${error.message}` });  
    }
};