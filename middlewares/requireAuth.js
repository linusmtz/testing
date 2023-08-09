var jwt = require('jsonwebtoken');

function validToken(req,res,next){ // middleware para verificar token
    try {
         let token = req.cookies.refreshTokenCookie;
        //let token = req.headers?.authorization; //token esta en los headers?   


        if(!token){ //no hay token
            throw new Error("No hay bearer token")
        }

        console.log(token);
        //token = 'Bearer tokenString.....'
        // necesito quitar Bearer 
        
        // token = token.split(' ')[1]; //quitamos el "Bearer " del token
        const payload = jwt.verify(token,process.env.JWT_REFRESH); //verificamos el token q sea valido y se asigna la informacion del token en payload
       console.log(payload);
        req.uid = payload.uid; // guardamos el userID en los reqs
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).send({errors:error.message});
    }


}
module.exports = {
    validToken
}