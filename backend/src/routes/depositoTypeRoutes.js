const express = require('express');
const router = express.Router();
const depositoTypeController = require('../controllers/depositoTypeController');

/**
 * @swagger
 * tags:
 *   name: DepositoTypes
 *   description: API endpoints for managing deposito types
 */

/**
 * @swagger
 * /deposito-types:
 *   get:
 *     summary: Retrieve all deposito types
 *     tags: [DepositoTypes]
 *     responses:
 *       200:
 *         description: List of deposito types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DepositoType'
 */

/**
 * @swagger
 * /deposito-types/{id}:
 *   get:
 *     summary: Retrieve a single deposito type by ID
 *     tags: [DepositoTypes]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Deposito Type ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deposito Type details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepositoType'
 *       404:
 *         description: Deposito Type not found
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DepositoType:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Deposito Type ID
 *         name:
 *           type: string
 *           description: Deposito Type name
 *         yearlyReturn:
 *           type: number
 *           format: float
 *           description: Yearly return rate
 */

router.post('/', depositoTypeController.createDepositoType);
router.get('/', depositoTypeController.getDepositoTypes);
router.get('/:id', depositoTypeController.getDepositoType);
router.put('/:id', depositoTypeController.updateDepositoType);
router.delete('/:id', depositoTypeController.deleteDepositoType);

module.exports = router;
