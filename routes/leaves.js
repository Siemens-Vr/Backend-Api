
const express=require('express')
const router=express.Router();

const {createLeave, updateLeave, deleteLeave, getAllLeave, getLeaveById}=require('../controllers/leaves')
 

router.get('/', (req,res)=>{
    res.json("testing the leave router")
})

router.post('/create', createLeave);
router.get('/getLeaves',getAllLeave )
router.get('/getLeaves/:id',getLeaveById)
router.patch('/:id/update', updateLeave)
router.delete('/:id/delete', deleteLeave)

module.exports=router;