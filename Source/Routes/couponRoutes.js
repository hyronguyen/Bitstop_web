import { Router } from 'express';
import { getCoupons,getAllOrders,addNewCoupon,getCouponsbyUser } from '../Controller/COUPONController.js';

const couponRoutes = Router();

// Route lấy tất cả category
couponRoutes.get('/get_coupon', getCoupons);
couponRoutes.get('/get_allOrders',getAllOrders);
couponRoutes.post('/post_addCoupon', addNewCoupon);
couponRoutes.get('/get_CouponbyUser/:iduser',getCouponsbyUser)
export default couponRoutes;
