const {getCards, createCards} = require('../controllers/cards')
const express = require('express')

const router = express.Router()


router.get('/:uuid' , getCards)
router.post('/:uuid', createCards)

module.exports = router