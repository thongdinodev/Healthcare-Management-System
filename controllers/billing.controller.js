const Billing = require('../models/billing.model')

const {billingValidate} = require('../utils/validation')
const handleTryCatchError = require('../utils/handleTryCatchError')

exports.getAllBillings = async (req, res, next) => {
    try {
        const billings = await Billing.findAll()

        res.status(200).json({
            status: 'success',
            length: billings.length,
            data: {
                billings
            }
        })
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)
        
    }
}

exports.getBilling = async (req, res, next) => {
    const billingId = req.params.billingId

    try {
        const billing = await Billing.findByPk(billingId)

        if (!billing) {
            handleTryCatchError(res, 400, `Can't find any billing with BillingId, please try again!`)
        } else {
            res.status(200).json({
                status: 'success',
                data: {
                    billing
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error.errors[0].message)
        
    }
}

exports.createBilling = async (req, res, next) => {
    const billing_date = req.body.billing_date
    const status = req.body.status

    const inputData = {
        billing_date,
        status
    }

    try {
        const {error, value} = billingValidate(inputData)
        console.log('====ERROR====', error);
        if (error) {
            handleTryCatchError(res, 400, error.details[0].message)
        } else {
            const newBilling = await Billing.create(inputData)
    
            res.status(200).json({
                status: 'success',
                newBilling: {
                    newBilling
                }
            })
        }

    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}

exports.updateBilling = async (req, res, next) => {
    const billingId = req.params.billingId

    const updateBillingDate = req.body.billing_date
    const updateStatus = req.body.status

    try {
        const billing = await Billing.findByPk(billingId)

        if (!billing) {
            handleTryCatchError(res, 404, `Can't find billing with id: ${billingId}`)
        } else {
            billing.billing_date = updateBillingDate ? updateBillingDate : billing.billing_date
            billing.status = updateStatus ? updateStatus : billing.status

            await billing.save()

            res.status(200).json({
                status: 'success',
                message: 'success to update billing id: ' + billingId,
                billingUpdate : {
                    billing
                }
            })
        }
    } catch (error) {
        console.log(error);
        handleTryCatchError(res, 400, error)
    }
}

exports.deleteBilling = (req, res, next) => {
    
}