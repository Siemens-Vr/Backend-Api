const {createCost_categories,archiveCategoryById, getCost_categories, updateCost_categories,get_cost_categories_by_id} = require('../controllers/cost_categories')
const express = require('express')

const router = express.Router()


router.get('/:uuid' , getCost_categories )
router.post('/:uuid', createCost_categories)
router.get('/category/:uuid', get_cost_categories_by_id)
router.put('/:uuid', updateCost_categories)
router.post('/:uuid/archive', archiveCategoryById)

module.exports = router