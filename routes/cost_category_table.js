const {get_cost_categories_table , create_cost_categories_table, update_cost_categories_table} = require('../controllers/cost_category_table')
const express = require('express')

const router = express.Router()


router.get('/:uuid' , get_cost_categories_table )
router.post('/:uuid', create_cost_categories_table)
router.put('/:uuid', update_cost_categories_table)

module.exports = router