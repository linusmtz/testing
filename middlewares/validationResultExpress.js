var {validationResult} = require('express-validator')

function validationResultExpress(req,res,next){
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    next();
}
module.exports = {
    validationResultExpress
}