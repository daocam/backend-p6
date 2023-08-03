const express = require('express');
const router = express.Router();

const sauceController = require('../controllers/sauce.js');

router.get('/', sauceController.getAllSauce);
router.post('/', sauceController.createSauce);
router.put('/:id', sauceController.updateSauce);
router.delete('/:id', sauceController.deleteSauce);
router.get('/:id', sauceController.getOneSauce);
router.post('/:id/like', sauceController.likeOrDislikeSauce);

module.exports = router;