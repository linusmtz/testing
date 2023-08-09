var express = require('express');
var router = express.Router();

var {body} = require('express-validator');
const { validationResultExpress } = require('../middlewares/validationResultExpress');
const { register, login,infoUser, refreshToken, logout } = require('../controllers/auth.controller');
var {validToken} = require('../middlewares/requireAuth');



//trim eliminates the blank spaces in the fields

// expressValidator checks body, email field.
// if email field is not an email the  will display msg but firstly, it will trim, normalizeEmail and finally checks if is email


//register route
router.post('/register',[
    body('email',"Esto no es un email").trim().normalizeEmail().isEmail(),
    body('password',"Formato de password incorrecto").trim().isLength({min:6}).custom((value,{req})=>{  
        // if value (password) is not equal to req.body.repassword
        if(value!==req.body.repassword){
            throw new Error('No coinciden las password')
        }

        return value;
    })
],
validationResultExpress,
register)

//login rout
router.post('/login',[
    body('email',"Esto no es un email").trim().normalizeEmail().isEmail(),
    body('password',"Formato de password incorrecto").trim().isLength({min:6})]
,validationResultExpress
,login)


//get user's email
router.get('/protected',validToken,infoUser);

//get token for request
router.get('/refresh',refreshToken);

//deletes refreshTokenCookie
router.get('/logout',logout);

module.exports = router;