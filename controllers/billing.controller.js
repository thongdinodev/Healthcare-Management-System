const Billing = require('../models/billing.model')
const {StatusCodes} = require('http-status-codes')

const {billingValidate} = require('../utils/validation')
const ApiError = require('../utils/ApiError')

exports.getAllBillings = async (req, res, next) => {
    try {
        const billings = await Billing.findAll()

        res.status(StatusCodes.OK).json({
            status: 'success',
            length: billings.length,
            data: {
                billings
            }
        })
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error.errors[0].message))
        
    }
}

exports.getBilling = async (req, res, next) => {
    const billingId = req.params.billingId

    try {
        const billing = await Billing.findByPk(billingId)

        if (!billing) {
            next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find any billing with BillingId, please try again!`))
        } else {
            res.status(StatusCodes.OK).json({
                status: 'success',
                data: {
                    billing
                }
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error.errors[0].message))
        
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
            next (new ApiError(StatusCodes.BAD_REQUEST, error.details[0].message))
        } else {
            const newBilling = await Billing.create(inputData)
    
            res.status(StatusCodes.CREATED).json({
                status: 'success',
                newBilling: {
                    newBilling
                }
            })
        }

    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
    }
}

exports.updateBilling = async (req, res, next) => {
    const billingId = req.params.billingId

    const updateBillingDate = req.body.billing_date
    const updateStatus = req.body.status

    try {
        const billing = await Billing.findByPk(billingId)

        if (!billing) {
            next (new ApiError(res, 404, `Can't find billing with id: ${billingId}`))
        } else {
            billing.billing_date = updateBillingDate ? updateBillingDate : billing.billing_date
            billing.status = updateStatus ? updateStatus : billing.status

            await billing.save()

            res.status(StatusCodes.OK).json({
                status: 'success',
                message: 'success to update billing id: ' + billingId,
                billingUpdate : {
                    billing
                }
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
    }
}

exports.deleteBilling = async (req, res, next) => {
    const billingId = req.params.billingId

    try {
        const billingDelete = await Billing.destroy({
            where: {
                billing_id: billingId
            }
        })

        if (!billingDelete) {
            next (new ApiError(StatusCodes.BAD_REQUEST, `Can't find any billing with id: ${billingId}`))
        } else {
            res.status(StatusCodes.OK).json({
                status: 'success',
                msg: 'DELETE SUCCESS'
            })
        }
    } catch (error) {
        console.log(error);
        next (new ApiError(StatusCodes.BAD_REQUEST, error))
        
    }
}