import { collection, query, where, getDocs,addDoc, doc ,getDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';

// Lấy tất cả sản phẩm
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
                des: data.pro_des || "No description",
                quan: data.pro_qa
            };
        });

        res.json(productsList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// thêm sản phẩm
export const addNewProduct = async (req, res) => {
    try {
        const { pro_title, pro_category, pro_price, pro_platform, pro_img, pro_des, pro_qa } = req.body;

        // Kiểm tra điều kiện input
        if (!pro_title || !pro_category || !pro_price ) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Kiểm tra title 
        const normalizedTitle = pro_title.toLowerCase().replace(/\s+/g, '');

         
              const productsCollection = collection(db, 'PRODUCTS');
              const querySnapshot = await getDocs(productsCollection);
      
   
              let isDuplicate = false;
              querySnapshot.forEach(doc => {
                  const existingTitle = doc.data().pro_title || '';
                  const normalizedExistingTitle = existingTitle.toLowerCase().replace(/\s+/g, '');
      
                  if (normalizedExistingTitle === normalizedTitle) {
                      isDuplicate = true;
                  }
              });
              if (isDuplicate) {
                  return res.status(400).json({ error: "Product title must be unique (case-insensitive and ignoring spaces)" });
              }

        // Tạo sản phẩm
        const newProduct = {
            pro_title,
            pro_category,
            pro_price,
            pro_platform,
            pro_img: pro_img || "No image available", 
            pro_des: pro_des || "No description", 
            pro_qa
        };

        // Thêm sản phẩm vào db
        const docRef = await addDoc(productsCollection, newProduct);

        // Cập nhật kho hàng
        const ProductStorage ={
            sto_product: docRef.id,
            sto_qa: 1
        }

        const productsStorage = collection(db,'STORAGE');
        const stoRef = await addDoc(productsStorage, ProductStorage);


        res.status(201).json({ id: docRef.id, ...newProduct });
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
                const platforms = data.pro_platform ? data.pro_platform.split(',') : []; // Split platforms by commas
                
                // If the product is available on the platform, include it in the result
                if (platforms.includes(productPlat)) {
                    return {
                        id: doc.id,
                        title: data.pro_title || "No title",  
                        category: data.pro_category || "No category",
                        price: data.pro_price || 0,
                        platform: data.pro_platform || "Unknown platform",
                        img: data.pro_img || "No image available",
                        des: data.pro_des || "No description available",
                        quan: data.pro_qa
                    };
                }
                return null;
            })
            .filter(product => product !== null); // Filter out null results

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
                    des: data.pro_des || "No description",
                    quan: data.pro_qa
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
                des: proData.pro_des || "No description available",
                quan: proData.pro_qa
            });
        } else {
            res.status(404).json({ message: "Product not found" });
        }

    } catch (error) {
        res.status(500).json({ message: `Error fetching product: ${error.message}` });  
    }
};

// Lấy sản phẩm theo category
export const getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        const productsCollection = collection(db, 'PRODUCTS');
        
        const q = query(productsCollection, where('pro_category', '==', category));

        const querySnapshot = await getDocs(q);

        const products = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();

            products.push({
                id: doc.id,
                title: data.pro_title || "No title",
                category: data.pro_category || "No category",
                price: data.pro_price || 0,
                platform: data.pro_platform || "Unknown platform",
                img: data.pro_img || "No image available",
                des: data.pro_des || "No description available",
                quan: data.pro_qa
            });
        });

        // Send the products as the response
        res.status(200).json(products);
    } catch (error) {
        // Handle any errors
        res.status(500).json({ message: 'Error retrieving products by category', error: error.message });
    }
};

// xóa sản phẩm theo ID
export const deleteProductById = async (req, res) =>{
    try{
        const {docID} = req.params

        
    }
    catch(error){

    }
}


// Xem sản phẩm trong kho
export const getProductStorage = async (req,res)=>{
    try {
        const querySnapshot = await getDocs(collection(db, 'STORAGE'));
            const Storage = [];
    
            querySnapshot.forEach(doc => {
                Storage.push({ id: doc.id, ...doc.data() });
            });
    
            res.status(200).json(Storage);
    }
    catch (error){
        res.status(500).json({ message: 'Error retrievin storage', error: error.message });
    }
}