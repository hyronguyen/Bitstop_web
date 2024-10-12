import { Router } from 'express';
import { getAllCategory } from '../Controller/CATEGORYController.js';

const categoryRounter = Router();

// Route lấy tất cả category
categoryRounter.get('/get_categories', getAllCategory);

export default categoryRounter;