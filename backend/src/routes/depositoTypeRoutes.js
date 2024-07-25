const express = require('express');
const router = express.Router();
const depositoTypeController = require('../controllers/depositoTypeController');

router.post('/', depositoTypeController.createDepositoType);
router.get('/', depositoTypeController.getDepositoTypes);
router.get('/:id', depositoTypeController.getDepositoType);
router.put('/:id', depositoTypeController.updateDepositoType);
router.delete('/:id', depositoTypeController.deleteDepositoType);

module.exports = router;