import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
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

// 1. GLOBAL MIDDLEWARE
// Place CORS at the very top
app.use(cors({
    origin: [
        'https://michael-mahber.vercel.app',
        'http://localhost:5173'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. HEALTH CHECK (Verify server is alive)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 3. API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/contributions', contributionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 4. PRODUCTION LANDING PAGE
// This replaces the "static file serving" that was causing crashes
app.get('/', (req, res) => {
    res.json({
        message: "Michael Mahber API is active",
        documentation: "Refer to project README for endpoint details"
    });
});

// 5. 404 CATCH-ALL (Must come AFTER routes)
app.use('/api/*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `API Route ${req.originalUrl} not found`
    });
});

// 6. GLOBAL ERROR HANDLER
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server Error:', err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

export default app;