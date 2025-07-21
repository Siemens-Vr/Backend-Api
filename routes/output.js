const express = require('express');
const router = express.Router();
const { getNotificationRead, getNotification, getUnreadNotification } = require('../controllers/user_notification');

const {
  createOutput,
  getAllOutputs,
  getOutputById,
  updateOutputById,
  archiveOutputById,
  bulkCreateOutputs,
  bulkEditOutputs,
  bulkGetOutputs,
  approveOutput,
  rejectOutput
} = require('../controllers/output');
const {upload} = require('../middleware/fileUploadMiddleware');


// Define routes
router.post('/bulk-create',upload, bulkCreateOutputs)
router.put('/bulk-edit',upload, bulkEditOutputs)
router.get('/bulk-get/:projectId', bulkGetOutputs)

router.post('/:milestoneId', upload,  createOutput);
router.get('/:milestoneId', getAllOutputs);
router.get('/single/:id', getOutputById);
router.put('/update/:id', upload, updateOutputById);
router.post('/:id/archive', archiveOutputById);
router.post('/approve/:id', approveOutput )
router.put('/reject/:id', rejectOutput )

router.get('/users/notifications', getNotification )

// router.delete('/milestones/:id', deleteOutputById);

module.exports = router;
