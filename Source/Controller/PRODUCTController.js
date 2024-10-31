import { collection, query, where, getDocs,addDoc, doc ,getDoc,updateDoc } from 'firebase/firestore';
import db from '../Configs/firestore.js';
import XLSX from 'xlsx';
import upload from '../Middleware/multer.js';
import fs from 'fs';

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

//#region Tìm kiếm
// Lấy tất cả sản phẩm
export const getAllProduct = async (req, res) => {
    try {
        const productsCollection = collection(db, 'PRODUCTS');
        const productsSnapshot = await getDocs(productsCollection);

        const productsList = await Promise.all(productsSnapshot.docs.map(async doc => {
            const data = doc.data();

            // Query the STORAGE collection for matching sto_product (product ID)
            const storageCollection = collection(db, 'STORAGE');
            const storageQuery = query(storageCollection, where('sto_product', '==', doc.id));
            const storageSnapshot = await getDocs(storageQuery);
            
            // Default quantity if not found
            let quan = "Unknown quantity";
            if (!storageSnapshot.empty) {
                const storageData = storageSnapshot.docs[0].data();  // Assuming one matching entry
                quan = storageData.sto_qa || quan;
            }

            return {
                id: doc.id,  
                title: data.pro_title || "No title",  
                category: data.pro_category || "No category",
                price: data.pro_price || 0,
                platform: data.pro_platform || "Unknown platform",
                img: data.pro_img || "No image available",
                des: data.pro_des || "No description",
                quan  // Use the retrieved quantity from STORAGE
            };
        }));

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

        const products = [];

        for (const doc of querySnapshot.docs) {
            const data = doc.data(); 
            const platforms = data.pro_platform ? data.pro_platform.split(',') : [];

            if (platforms.includes(productPlat)) {
                // Fetch corresponding quantity from STORAGE
                const storageCollection = collection(db, 'STORAGE');
                const storageQuery = query(storageCollection, where('sto_product', '==', doc.id));
                const storageSnapshot = await getDocs(storageQuery);

                let quan = data.pro_qa;  // Default to product's quantity from PRODUCTS
                if (!storageSnapshot.empty) {
                    const storageData = storageSnapshot.docs[0].data();
                    quan = storageData.sto_qa || quan;  // Update with STORAGE quantity if available
                }

                products.push({
                    id: doc.id,
                    title: data.pro_title || "No title",
                    category: data.pro_category || "No category",
                    price: data.pro_price || 0,
                    platform: data.pro_platform || "Unknown platform",
                    img: data.pro_img || "No image available",
                    des: data.pro_des || "No description",
                    quan  // Updated quan value
                });
            }
        }

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm phù hợp với nền tảng.' });
        }

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

        for (const doc of querySnapshot.docs) {
            const data = doc.data();
            const titleLower = data.pro_title.toLowerCase();
            const anyKeywordPresent = keywordArray.some((kw) => titleLower.includes(kw));

            if (anyKeywordPresent) {
                // Fetch corresponding quantity from STORAGE
                const storageCollection = collection(db, 'STORAGE');
                const storageQuery = query(storageCollection, where('sto_product', '==', doc.id));
                const storageSnapshot = await getDocs(storageQuery);

                let quan = data.pro_qa;  // Default to the product quantity from PRODUCTS
                if (!storageSnapshot.empty) {
                    const storageData = storageSnapshot.docs[0].data();
                    quan = storageData.sto_qa || quan;  // Update with STORAGE quantity if available
                }

                products.push({
                    id: doc.id,
                    title: data.pro_title || "No title",
                    category: data.pro_category || "No category",
                    price: data.pro_price || 0,
                    platform: data.pro_platform || "Unknown platform",
                    img: data.pro_img || "No image available",
                    des: data.pro_des || "No description",
                    quan  // Updated quan value
                });
            }
        }

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

            // Fetch corresponding quantity from STORAGE
            const storageCollection = collection(db, 'STORAGE');
            const storageQuery = query(storageCollection, where('sto_product', '==', DocID));
            const storageSnapshot = await getDocs(storageQuery);

            let quan = proData.pro_qa;  // Default to product's quantity from PRODUCTS
            if (!storageSnapshot.empty) {
                const storageData = storageSnapshot.docs[0].data();
                quan = storageData.sto_qa || quan;  // Update with STORAGE quantity if available
            }

            res.status(200).json({
                id: proDoc.id,
                title: proData.pro_title || "No title",
                category: proData.pro_category || "No category",
                price: proData.pro_price || 0,
                platform: proData.pro_platform || "Unknown platform",
                img: proData.pro_img || "No image available",
                des: proData.pro_des || "No description available",
                quan  // Updated quan value
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

        for (const doc of querySnapshot.docs) {
            const data = doc.data();

            // Fetch corresponding quantity from STORAGE
            const storageCollection = collection(db, 'STORAGE');
            const storageQuery = query(storageCollection, where('sto_product', '==', doc.id));
            const storageSnapshot = await getDocs(storageQuery);

            let quan = data.pro_qa;  // Default to product's quantity from PRODUCTS
            if (!storageSnapshot.empty) {
                const storageData = storageSnapshot.docs[0].data();
                quan = storageData.sto_qa || quan;  // Update with STORAGE quantity if available
            }

            products.push({
                id: doc.id,
                title: data.pro_title || "No title",
                category: data.pro_category || "No category",
                price: data.pro_price || 0,
                platform: data.pro_platform || "Unknown platform",
                img: data.pro_img || "No image available",
                des: data.pro_des || "No description",
                quan  // Updated quan value
            });
        }

        if (products.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh mục.' });
        }

        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving products by category', error: error.message });
    }
};
//#endregion

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

export const UpdatePriceListNcc = async (req, res) => {
    try {
        const filePath = req.file.path;

        // Đọc file Excel và lấy dữ liệu dưới dạng mảng 2 chiều
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        // Lặp qua từng hàng từ hàng thứ 2 trong Excel
        for (let i = 2; i < data.length; i++) {
            const [productId, nccPrice] = data[i];

            if (productId && nccPrice) {
                // Truy vấn Firestore để tìm tài liệu phù hợp với `product_id`
                const nccPriceCollection = collection(db, 'NCCPRICE');
                const q = query(nccPriceCollection, where('product_id', '==', productId));
                const querySnapshot = await getDocs(q);

                // Nếu tìm thấy tài liệu, cập nhật giá trị `ncc_price`
                querySnapshot.forEach(async (doc) => {
                    await updateDoc(doc.ref, { ncc_price: nccPrice });
                });
            }
        }

        // Xóa file sau khi xử lý và trả về phản hồi
        fs.unlinkSync(filePath);
        res.status(200).json({ message: "Prices updated successfully for all products" });

    } catch (error) {
        res.status(500).json({ error: `Failed to update prices: ${error.message}` });
    }
};

export const GetProductwithNccPrice = async (req, res) => {
    try {
        const productsCollection = collection(db, 'PRODUCTS');
        const nccPriceCollection = collection(db, 'NCCPRICE');

        // Lấy tất cả tài liệu trong collection PRODUCT
        const productsSnapshot = await getDocs(productsCollection);
        const nccPricesSnapshot = await getDocs(nccPriceCollection);

        // Chuyển đổi NCCPRICE thành một đối tượng cho nhanh chóng tìm kiếm
        const nccPrices = {};
        nccPricesSnapshot.forEach(doc => {
            const data = doc.data();
            nccPrices[data.product_id] = { ncc_price: data.ncc_price, docId: doc.id };
        });

        // Tạo mảng để lưu thông tin sản phẩm kèm theo ncc_price
        const result = [];
        productsSnapshot.forEach(doc => {
            const productData = doc.data();
            const productId = doc.id;  // ID của document trong collection PRODUCT

            // Kiểm tra xem ncc_price có tồn tại cho product_id tương ứng không
            if (nccPrices[productId]) {
                result.push({
                    pro_title: productData.pro_title,
                    docId: productId,
                    ncc_price: nccPrices[productId].ncc_price,
                });
            }
        });

        // Gửi kết quả về phía client
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: `Failed to fetch products with NCC price: ${error.message}` });
    }
};