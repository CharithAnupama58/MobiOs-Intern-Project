import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use('/auth', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));

app.listen(3000, () => {
    console.log('API Gateway running on port 3000');
});
