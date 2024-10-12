import { Router } from 'express';
import { getAllProduct, getProductbyPlatform ,getProductByKeyword, getProductById, getProductByCategory, addNewProduct, getProductStorage} from '../Controller/PRODUCTController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const productsRouter = Router();

// Route lấy tất cả sản phẩm
productsRouter.get('/get_products', getAllProduct);

// Route lấy tất cả sản phảm với cate truyền vào
productsRouter.get('/get_productbyplat/:productPlat',getProductbyPlatform);

// Route tìm sản phẩm theo key word
productsRouter.get('/get_productbykey/:keyword',getProductByKeyword);

// Route tìm sản phẩm  theo ID
productsRouter.get('/get_productbyid/:DocID',getProductById);

// Route tìm sản phẩm theo Category
productsRouter.get('/get_productbycategory/:category',getProductByCategory)

// Route add sản phẩm 
productsRouter.post('/add_product',addNewProduct)

// Route xem sản phẩm trong kho
productsRouter.get('/check_storage',getProductStorage)

export default productsRouter;
