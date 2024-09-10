import express from 'express';
import rootRouter from './Routes/rootRoutes.js'; 
import cors from 'cors';  

const app = express();
app.use(express.json());
app.use(cors()); 
//set route gốc
app.use('/api', rootRouter);

app.listen(8080, () => {
  console.log('Server chạy ở http://localhost:8080');
});
