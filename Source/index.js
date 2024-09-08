import express from 'express';
import rootRouter from './Routes/rootRoutes.js'; // Ensure this path is correct

const app = express();
app.use(express.json());

// Use rootRouter for all routes starting with /api
app.use('/api', rootRouter);

app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
