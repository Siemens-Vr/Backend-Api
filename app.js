const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const passport = require('./config/passport');
const cookieParser = require('cookie-parser');
const http = require('http');
const OnlineTracker = require('./websocket/onlineTracker');
const activityLogger = require('./middleware/activityLogger');
require('dotenv').config();

const { isAuthenticated } = require('./middleware/auth');


const studentRouter = require('./routes/students');
const cohortRouter = require('./routes/cohort');
const levelRouter = require('./routes/level');
const staffRouter = require('./routes/staff');
const facilitatorsRouter = require('./routes/facilitator');
const userRouter = require('./routes/users');
const componentsRouter = require('./routes/component');
const borrowRouter = require('./routes/borrow');
const notificationsRouter = require('./routes/notification');
const notificationRoutes = require('./routes/job');
const categoriesRouter = require('./routes/categories');
const procurementRouter = require('./routes/procurement');
const projectsRouter = require('./routes/projects');
const phasesRouter = require('./routes/phases');
const assigneesRouter = require('./routes/assignees');
const deliverablesRouter = require('./routes/deliverables');
const feeRouter = require('./routes/fee');
const documentsRouter = require('./routes/documentRoutes');
const folderRouter = require('./routes/folder');
const subFolderRouter = require('./routes/subFolder');
const weekRouter = require('./routes/weeks');
const materialRouter = require('./routes/materials');
const applicantsRouter = require('./routes/applicants');
const transportRouter = require('./routes/transport');
const reportRouter = require('./routes/reports');
const milestoneRouter = require('./routes/milestones');
const outputRouter = require('./routes/output');
const leaveRouter = require('./routes/leaves');
const leaveRequestRouter = require('./routes/leaveRequests');
const todoRouter = require('./routes/todo');
const cardRouter = require('./routes/cards');
const cost_categories_Router = require('./routes/cost_categories');
const cost_categories_table_Router = require('./routes/cost_category_table');
const cost_cat_documents = require('./routes/cost_categories_documents');
const onlineRoutes = require('./routes/online');


const app = express();
const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

// Initialize WebSocket tracker for online users
const onlineTracker = new OnlineTracker(server);

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://vml-erp.dkut.ac.ke'];


// Middleware setup
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Public Route: No authentication required for this route
app.get('/',(req, res)=> res.status(200).json("Everthing is good"))
app.use('/api/auth', userRouter);


app.use(isAuthenticated)

// This will log all API calls after authentication
app.use('/api/online', onlineRoutes);
app.use(activityLogger({
    excludeRoutes: ['/health', '/favicon.ico', '/ws', '/', '/api/auth/login', '/api/auth/register'],
    excludeMethods: ['OPTIONS'],
    logBody: false, 
    logQuery: true 
}));

// Add session ID to requests for activity logging
app.use((req, res, next) => {
    // Generate or get session ID for activity logging
    if (req.user && req.user.userId) {
        req.sessionId = `${req.user.userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    next();
});

// All your existing routes
app.use('/facilitators', facilitatorsRouter);
app.use('/staffs', staffRouter);
app.use('/levels', levelRouter);
app.use('/cohorts', cohortRouter);
app.use('/students', studentRouter);
app.use('/components', componentsRouter);
app.use('/borrow', borrowRouter);
app.use('/notifications', notificationsRouter);
app.use('/categories', categoriesRouter);
app.use('/job', notificationRoutes);
app.use('/procurements', procurementRouter);
app.use('/transports', transportRouter);
app.use('/projects', projectsRouter);
app.use('/phases', phasesRouter);
app.use('/assignees', assigneesRouter);
app.use('/deliverables', deliverablesRouter);
app.use('/fee', feeRouter);
app.use('/documents', documentsRouter);
app.use('/folders', folderRouter);
app.use('/subFolders', subFolderRouter);
app.use('/weeks', weekRouter);
app.use('/materials', materialRouter);
app.use('/applicants', applicantsRouter);
app.use('/reports', reportRouter);
app.use('/milestones', milestoneRouter);
app.use('/outputs', outputRouter);
app.use('/leaves', leaveRouter);
app.use('/leaveRequests', leaveRequestRouter);
app.use('/todos', todoRouter);
app.use('/cards', cardRouter);
app.use('/cost_categories', cost_categories_Router);
app.use('/cost_categories_tables', cost_categories_table_Router);
app.use('/cost_cat', cost_cat_documents);


// File download route
app.get('/download/*', (req, res) => {
    const filePath = req.params[0];
    const fullPath = path.join(__dirname, filePath);
    res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    res.sendFile(fullPath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(404).send('File not found');
        }
    });
});



// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        onlineUsers: onlineTracker ? 'active' : 'inactive'
    });
});

// Cleanup inactive users every 5 minutes
setInterval(() => {
    if (onlineTracker) {
        onlineTracker.cleanupInactiveUsers()
            .then(() => {
                console.log('🧹 Cleaned up inactive users');
            })
            .catch(error => {
                console.error('Error cleaning up inactive users:', error);
            });
    }
}, 5 * 60 * 1000); // 5 minutes

// Cleanup very old activity logs every hour (optional)
setInterval(() => {
    const { ActivityLog } = require('./models');
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    ActivityLog.destroy({
        where: {
            timestamp: {
                [require('sequelize').Op.lt]: thirtyDaysAgo
            }
        }
    }).then(deletedCount => {
        if (deletedCount > 0) {
            console.log(`🗑️ Cleaned up ${deletedCount} old activity logs`);
        }
    }).catch(error => {
        console.error('Error cleaning up old activity logs:', error);
    });
}, 60 * 60 * 1000); // 1 hour



// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('🛑 Server shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('🛑 Server shutting down gracefully...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});

// Start the server using the HTTP server (not app.listen)
server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 WebSocket server is running on port ${PORT}`);
    console.log(`🔗 WebSocket URL: ws://localhost:${PORT}/ws`);
    console.log(`🌐 API Base URL: http://localhost:${PORT}`);
    console.log(`📊 Online tracking dashboard: http://localhost:${PORT}/api/online`);
});





