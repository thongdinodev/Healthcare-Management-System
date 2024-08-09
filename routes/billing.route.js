const express = require('express')

const router = express.Router()
const billingController = require('../controllers/billing.controller')

router
    .route('/')
    .get(billingController.getAllBillings)

router 
    .route('/')
    .post(billingController.createBilling)

router
    .route('/:billingId')
    .get(billingController.getBilling)


router
    .route('/:billingId')
    .patch(billingController.updateBilling)

router
    .route('/:billingId')
    .delete(billingController.deleteBilling)

module.exports = router