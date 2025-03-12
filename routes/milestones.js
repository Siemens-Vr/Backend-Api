const express = require("express");
const {
  createMilestone,
  getAllMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone
} = require("../controllers/milestones");

const router = express.Router();

router.post("/:projectId", createMilestone);         
router.get("/:projectId", getAllMilestones);         
router.get("/:uuid", getMilestoneById);    
router.put("/update/:uuid", updateMilestone);     
router.delete("/delete/:uuid", deleteMilestone);  



module.exports = router;
