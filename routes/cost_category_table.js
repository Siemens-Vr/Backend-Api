const {get_cost_categories_table , create_cost_categories_table, updateCost_categories} = require('../controllers/cost_category_table')
const express = require('express')

const router = express.Router()


router.get('/:uuid' , get_cost_categories_table )
router.post('/:uuid', create_cost_categories_table)
// router.put('/:uuid', updateCost_categories)

module.exports = router