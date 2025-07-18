<<<<<<< HEAD
const {get_cost_categories_table ,archiveCategoryById, create_cost_categories_table, update_cost_categories_table} = require('../controllers/cost_category_table')
=======
const {get_cost_categories_table , create_cost_categories_table, update_cost_categories_table} = require('../controllers/cost_category_table')
>>>>>>> 30beef46a66afb5ddae18f947a1e6ef655e75f91
const express = require('express')

const router = express.Router()


router.get('/:uuid' , get_cost_categories_table )
router.post('/:uuid', create_cost_categories_table)
router.put('/:uuid', update_cost_categories_table)
<<<<<<< HEAD
router.put('/archive/:uuid', archiveCategoryById)
=======
>>>>>>> 30beef46a66afb5ddae18f947a1e6ef655e75f91

module.exports = router