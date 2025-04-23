const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const passport = require('./config/passport');
const { Folder, SubFolder,Document } = require('./models');


// Import the routes
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
const applicantsRouter = require('./routes/applicants')
const transportRouter = require('./routes/transport')
const reportRouter = require('./routes/reports')
const milestoneRouter=require('./routes/milestones')
const outputRouter=require('./routes/output')


const leaveRouter = require('./routes/leaves')
const leaveRequestRouter = require('./routes/leaveRequests')
const todoRouter = require('./routes/todo')

const {isAuthenticated} = require('./middleware/auth');


const multer = require('multer');
const fs = require('fs');


// Define the multer storage and upload middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Temporary folder to store uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage });



const app = express();
const PORT = process.env.PORT || 5000;


// app.use(cors())
app.use(passport.initialize());
// app.options('*', cors());


const allowedOrigins = ['http://localhost:3000', 'https://vmlab.dkut.ac.ke/'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     next();
//   });
  

// Public Route: No authentication required for this route
app.use('/api/auth', userRouter);


// Protected Routes: Apply `isAuthenticated` middleware to all other routes

app.use(isAuthenticated);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/staffUploads', express.static(path.join(__dirname, 'staffUploads')));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


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
app.use('/transports', transportRouter)
app.use('/projects', projectsRouter);
app.use('/phases', phasesRouter);
app.use('/assignees', assigneesRouter);
app.use('/deliverables', deliverablesRouter);
app.use('/fee', feeRouter);
app.use('/documents',documentsRouter);
app.use('/folders',folderRouter);
app.use('/subFolders',subFolderRouter);
app.use('/weeks',weekRouter);
app.use('/materials',materialRouter);
app.use('/applicants', applicantsRouter)
app.use('/reports', reportRouter)
app.use('/milestones', milestoneRouter)
app.use('/outputs', outputRouter)

app.use('/leaves' , leaveRouter)
app.use('/leaveRequests' , leaveRequestRouter)
app.use('/todos', todoRouter)

// Test route to verify server is running



// Add a file download route
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

app.post('/foldersUpload/:uuid/:folderPath?/:currentFolderId?', upload.array('files'), async (req, res) => {
    console.log("Uploading files");
    const files = req.files;
    const filePaths = req.body.filePaths; 
    const folderPath = req.params.folderPath; 

    try {
        // Retrieve the folder name
        const folderName = folderPath
            ? path.basename(folderPath)
            : filePaths && filePaths[0]
            ? path.dirname(filePaths[0]).split(path.sep).pop()
            : 'default_folder';
        console.log("Folder Name:", folderName);

        const projectId = req.params.uuid;

        // Create the folder entry in the backend
        const folder = await Folder.create({
            projectId,
            folderName,
        });

        if (!folder) {
            return res.status(400).json({ error: 'Error creating the folder' });
        }

        // Save file paths in the backend and move files
        const documents = [];
        files.forEach((file, index) => {
            const relativePath = filePaths[index];
            const fullPath = path.join('uploads', relativePath);
            fs.mkdirSync(path.dirname(fullPath), { recursive: true });
            fs.renameSync(file.path, fullPath);

            // Add file data to be inserted into the database
            documents.push({
                projectId,
                folderId: folder.uuid, // Associate with the folder created above
                documentPath: fullPath, // Store the full path to the document
                documentName: file.originalname, // Store the original file name
            });
        });

        // Bulk create document entries in the backend
        const createdDocuments = await Document.bulkCreate(documents);

        res.status(200).json({
            message: `Folder '${folderName}' and files uploaded successfully!`,
            folder,
            documents: createdDocuments,
        });
    } catch (error) {
        console.error("Error uploading folder and files:", error);
        res.status(500).json({ message: 'Error uploading folder and files.' });
    }
});





// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});





