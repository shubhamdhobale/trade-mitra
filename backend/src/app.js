import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.route.js'
import userRoute from './routes/user.route.js'
import tradeRouter from './routes/trade.route.js';
import { errorHandler, notFound } from './middleware/error.middleware.js';


dotenv.config();
const app = express();

//security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

//Logging
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

//Routes
app.use('/api/auth' , authRoutes);
app.use('/api/user' , userRoute);
app.use('/api/trade' , tradeRouter);

//Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;