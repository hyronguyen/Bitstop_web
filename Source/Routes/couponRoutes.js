import { Router } from 'express';
import { getCoupons,getAllOrders,addNewCoupon } from '../Controller/COUPONController.js';

const couponRoutes = Router();

// Route lấy tất cả category
couponRoutes.get('/get_coupon', getCoupons);
couponRoutes.get('/get_allOrders',getAllOrders);
couponRoutes.post('/post_addCoupon', addNewCoupon);
export default couponRoutes;
