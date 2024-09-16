const apiFeatures = function (req) {
    const filterObj = {...req.query}
    const excludedFields = ['page', 'limit']
    excludedFields.forEach((el) => delete filterObj[el])

    const pageAsNumber = parseInt(req.query.page)
    const limitAsNumber = parseInt(req.query.limit)

    let page = 0
    if (!(isNaN(pageAsNumber)) && pageAsNumber > 0) {
        page = pageAsNumber
    }
    
    let limit = 10
    if (!(isNaN(limitAsNumber)) && limitAsNumber > 0 && limitAsNumber < 10) {
        limit = limitAsNumber
    }

    return [filterObj, page, limit]
}

module.exports = {
    apiFeatures
}