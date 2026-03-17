import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/database';

// Import routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import loanRoutes from './routes/loan.routes';
import contributionRoutes from './routes/contribution.routes';
import dashboardRoutes from './routes/dashboard.routes';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. CORS - Explicitly allowing your Vercel frontend
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://michael-mahber.vercel.app'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// 3. STATIC FILES
app.use('/uploads', express.static('uploads'));

// 4. MOUNT ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 5. HEALTH CHECK
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running'
    });
});

// 6. 404 HANDLER
// This only catches things that aren't defined in the routes above
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route ${req.originalUrl} not found`
    });
});

// 7. GLOBAL ERROR HANDLER
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error Stack:', err.stack);
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;