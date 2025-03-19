
const express=require('express')
const router=express.Router();

const {createLeave, updateLeave, deleteLeave}=require('../controllers/leaves')
 

router.get('/', (req,res)=>{
    res.json("testing the leave router")
})

router.post('/:userUUID/create', createLeave);
router.patch('/:userUUID/:id/update', updateLeave)
router.delete('/:userUUID/:id/delete', deleteLeave)

module.exports=router;