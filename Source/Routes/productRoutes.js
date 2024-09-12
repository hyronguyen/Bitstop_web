import { Router } from 'express';
import { getAllProduct, getProductbyPlatform } from '../Controller/PRODUCTController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const productsRouter = Router();

// Route lấy tất cả sản phẩm
productsRouter.get('/get_products', getAllProduct);

// Route lấy tất cả sản phảm với cate truyền vào
productsRouter.get('/get_productbyplat/:productPlat',getProductbyPlatform);


export default productsRouter;
